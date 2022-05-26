/* eslint-disable no-console */
/**
 *
 * PaymentForm
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import * as AuthSelectors from 'data/selectors/authSelectors';
import * as AuthActions from 'data/actions/AuthActions';
import Button from 'components/Button';
import CardExpiry from './CardExpiry';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

// const StyledButton = styled(Button)`
//   background-color: #22af9a !important;
//   color: white !important;
// `;

// const StyledTextField = styled(TextField)`
//   display: block;
//   max-width: 300px;
//   min-width: 210px;
//   width: 100%;
//   font-size: 1em;
//   font-family: 'Source Code Pro', monospace;
//   box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px,
//     rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
//   border: none !important;
//   outline: none !important;
//   border-radius: 4px;
//   background: white;
//   margin: 10px 0 14px 0 !important;

//   &:placeholder {
//     color: #87bbfd !important;
//   }

//   &:focus {
//     box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px,
//       rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
//     -webkit-transition: all 150ms ease;
//     transition: all 150ms ease;
//     outline: none;
//   }

//   & input {
//     border: none !important;
//     padding: 10px 14px;
//     width: 100% !important;
//   }

//   & ::before {
//     border: none !important;
//   }
// `;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0px, 1fr);
  max-width: none;

  @media (min-width: 1440px) {
    grid-template-columns: repeat(3, minmax(0px, 1fr));
  }

  @media (min-width: 1280px) {
    gap: 32px;
  }
  @media (min-width: 1024px) {
    gap: 24px;
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0px, 1fr));
    gap: 16px;
  }
`;

const SubmitButton = styled(Button)`
  padding: 15px;
`;

class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardName: '',
      cardNumber: '',
      zipCode: '',
      cvc: '',
      expiry: '',
      routingNumber: '',
      accountNumber: '',
      tabIndex: 0,
    };
  }

  updateForm = evt => {
    const {
      target: { value, name },
    } = evt;
    const shouldUpdateCN = name === 'cardNumber' && value.length <= 19;
    const shouldUpdateCVC = name === 'cvc' && value.length <= 3;
    const shouldUpdateExp = name === 'expiry' && value.length <= 5;
    const shouldUpdateZip = name === 'zipCode' && value.length <= 5;
    const shouldUpdateAccountNum =
      name === 'routingNumber' && value.length <= 9;
    const shouldUpdateRoutingNum =
      name === 'accountNumber' && value.length <= 17;
    if (
      shouldUpdateCN ||
      shouldUpdateCVC ||
      shouldUpdateExp ||
      shouldUpdateZip ||
      shouldUpdateRoutingNum ||
      shouldUpdateAccountNum
    ) {
      this.setState({ [name]: value });
    }
  };

  testZipCode = value => {
    const re = /^\d{5}(?:[-\s]\d{4})?$/;
    return re.test(value);
  };

  testAccountNumber = value => {
    const re = /^\w{1,17}$/;
    return re.test(value);
  };

  testExpiry = value => {
    const re = /^((0[1-9])|(1[0-2]))\/((2020)|([1-2][0-9]))$/;
    return re.test(value);
  };

  testCreditCardNumber = value => {
    const re = /(^4[0-9]{12}(?:[0-9]{3})?$)|(^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$)|(3[47][0-9]{13})|(^3(?:0[0-5]|[68][0-9])[0-9]{11}$)|(^6(?:011|5[0-9]{2})[0-9]{12}$)|(^(?:2131|1800|35\d{3})\d{11}$)/;
    return re.test(value);
  };

  handleSubmit = () => {
    const { onCardSubmit, onBankSubmit } = this.props;
    const paymentType = this.state.tabIndex === 0 ? 'card' : 'bank';
    if (paymentType === 'bank') {
      onBankSubmit({ paymentType, ...this.state });
    }
    if (paymentType === 'card') {
      onCardSubmit({ paymentType, ...this.state });
    }
  };

  renderCardForm() {
    return (
      <div className="container-sm full-height mt-4 d-flex flex-column">
        <h1>Card Info</h1>
        <div className="d-flex flex-column">
          {true && (
            <TextField
              label="Name on Card"
              type="nameonCard"
              name="nameonCard"
              value={this.state.cardName}
              onChange={this.updateForm}
              placeholder="Name on Card"
              variant="outlined"
              margin="normal"
            />
          )}
        </div>

        <CardGrid>
          <TextField
            label="Card Number"
            name="cardNumber"
            value={this.state.cardNumber}
            onChange={this.updateForm}
            placeholder="Card Number"
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Expiry"
            name="expiry"
            value={this.state.expiry}
            onChange={this.updateForm}
            placeholder="Exp."
            variant="outlined"
            margin="normal"
            InputProps={{
              inputProps: {
                component: <NumberFormat format="+1 (###) ###-####" mask="_" />,
              },
              inputComponent: CardExpiry,
            }}
          />
          <TextField
            label="CVC"
            name="cvc"
            value={this.state.cvc}
            onChange={this.updateForm}
            placeholder="CVC"
            variant="outlined"
            margin="normal"
          />
        </CardGrid>

        <TextField
          label="Zip Code"
          name="zipCode"
          value={this.state.zipCode}
          onChange={this.updateForm}
          placeholder="Zip Code"
          variant="outlined"
          margin="normal"
        />
        <SubmitButton className="full-width" onClick={this.handleSubmit}>
          Add Payment Method
        </SubmitButton>
      </div>
    );
  }

  renderBankForm() {
    return (
      <div className="container-sm full-height mt-4 d-flex flex-column">
        <h1> Bank Information </h1>
        <div className="d-flex flex-column">
          <TextField
            label="Account Number"
            name="accountNumber"
            placeholder="Account Number"
            onChange={this.updateForm}
            value={this.state.accountNumber}
            error={!this.testAccountNumber(this.state.accountNumber)}
            variant="outlined"
            margin="normal"
          />
        </div>
        <div className="d-flex flex-column">
          <TextField
            label="Routing Number"
            name="routingNumber"
            placeholder="Routing Number"
            onChange={this.updateForm}
            value={this.state.routingNumber}
            variant="outlined"
            margin="normal"
          />
        </div>

        <SubmitButton className="mt-3 full-width" onClick={this.handleSubmit}>
          Add Payment Method
        </SubmitButton>
      </div>
    );
  }

  renderTabForm() {
    return (
      <div className="full-width">
        <Tabs
          className="mb-4"
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          value={this.state.tabIndex}
          onChange={(e, val) => this.setState({ tabIndex: val })}
          aria-label="full width tabs example"
        >
          <Tab label="Card" />
          <Tab label="Bank Account" />
        </Tabs>
        <TabPanel value={this.state.tabIndex} index={0}>
          {this.renderCardForm()}
        </TabPanel>
        <TabPanel value={this.state.tabIndex} index={1}>
          {this.renderBankForm()}
        </TabPanel>
      </div>
    );
  }

  render() {
    return <div>{this.renderTabForm()}</div>;
  }
}

PaymentForm.propTypes = {
  showCardForm: PropTypes.bool,
  showBankForm: PropTypes.bool,
  onCardSubmit: PropTypes.func,
  onBankSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  email: AuthSelectors.getEmail,
  is2faEnabled: AuthSelectors.getIs2faEnabled,
});

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: () => dispatch(AuthActions.fetchUserInfo()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(PaymentForm);
