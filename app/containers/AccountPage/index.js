/**
 *
 * AccountPage
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Routes from 'data/Routes';
import { Link, Switch, Route } from 'react-router-dom';
import AvailabilityHome from 'containers/AccountPage/Availability';
import * as AuthSelectors from 'data/selectors/authSelectors';
import { cadenzoPrimary } from 'utils/CssVariables';
import PaymentMethods from './PaymentMethods';
import LoginSecurity from './Security';
import PersonalInfo from './PersonalInfo';
import Security from './Security';
import FormModal from './FormModal';

const Header = styled.h1`
  font-size: 48px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: 300;
`;

const NewCard = styled.div`
  display: block;
  padding: 24px 20px;
  box-shadow: rgb(0 0 0 / 8%) 0px 10px 20px -5px;
  background-color: rgb(255, 255, 255);
  color: rgb(39, 44, 53);
  text-decoration: none !important;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

const CardTitle = styled.div`
  margin: 0px 0px 24px;

  h1 {
    font-weight: 500;
    font-stretch: normal;
    color: rgb(39, 44, 53);
    display: inline;
    letter-spacing: normal;
    margin-right: 10px;
    line-height: 1.43;
    font-size: 18px;

    @media (min-width: 768px) {
      font-size: 20px;
    }
  }
`;

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  max-width: 1920px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0px, 1fr);
  row-gap: 20px;
  max-width: none;
  margin: 0px auto;

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
    grid-template-columns: repeat(2, minmax(0px, 1fr));
    gap: 16px;
  }
`;

const UpdateContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  color: ${cadenzoPrimary};
  cursor: pointer;
  text-align: right;
`;

const FieldLabel = styled.h1`
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 10px;
`;

class AccountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showUpdateInfo: false,
      showChangePassword: false,
      showUpdatePlan: false,
      showPaymentMethod: false,
    };
    this.onToggleUpdateInfo = this.onToggleUpdateInfo.bind(this);
    this.onToggleChangePassword = this.onToggleChangePassword.bind(this);
    this.onToggleUpdatePlan = this.onToggleUpdatePlan.bind(this);
    this.onToggleUpdatePayment = this.onToggleUpdatePayment.bind(this);
  }

  onToggleUpdateInfo() {
    const { showUpdateInfo } = this.state;
    this.setState({
      showUpdateInfo: !showUpdateInfo,
    });
  }

  onToggleChangePassword() {
    const { showChangePassword } = this.state;
    this.setState({
      showChangePassword: !showChangePassword,
    });
  }

  onToggleUpdatePlan() {
    const { showUpdatePlan } = this.state;
    this.setState({
      showUpdatePlan: !showUpdatePlan,
    });
  }

  onToggleUpdatePayment() {
    const { showPaymentMethod } = this.state;
    this.setState({
      showPaymentMethod: !showPaymentMethod,
    });
  }

  renderAccountHome = () => {
    const { email, name, phoneNumber } = this.props;
    const {
      showPaymentMethod,
      showUpdatePlan,
      showChangePassword,
      showUpdateInfo,
    } = this.state;
    return (
      <Wrapper>
        {showPaymentMethod && (
          <FormModal
            header="Payment Method"
            isOpen={showPaymentMethod}
            onClose={this.onToggleUpdatePayment}
          >
            <PaymentMethods />
          </FormModal>
        )}

        {showChangePassword && (
          <FormModal
            header="Change Password"
            isOpen={showChangePassword}
            onClose={this.onToggleChangePassword}
          >
            <Security />
          </FormModal>
        )}

        {showUpdateInfo && (
          <FormModal
            header="Basic Info"
            isOpen={showUpdateInfo}
            onClose={this.onToggleUpdateInfo}
          >
            <PersonalInfo />
          </FormModal>
        )}

        <Header>Manage Account</Header>
        <CardGrid>
          <section>
            <NewCard to={Routes.accountPersonalInfo()}>
              <CardTitle>
                <UpdateContainer>
                  <h1> Your Account </h1>
                  <ActionButton onClick={() => this.onToggleUpdateInfo()}>
                    Update Info
                  </ActionButton>
                </UpdateContainer>
              </CardTitle>
              <FieldLabel> Name </FieldLabel>
              <h1> {name} </h1>
              <FieldLabel> Email </FieldLabel>
              <h1> {email} </h1>
              <FieldLabel> Phone </FieldLabel>
              <h1> {phoneNumber} </h1>
              <hr />
              <UpdateContainer>
                <FieldLabel> Password</FieldLabel>
                <ActionButton onClick={() => this.onToggleChangePassword()}>
                  {' '}
                  Change Password
                </ActionButton>
              </UpdateContainer>
              <p>...............</p>
            </NewCard>
          </section>

          <section>
            {false && (
              <NewCard to={Routes.accountPersonalInfo()}>
                <CardTitle>
                  <UpdateContainer>
                    <h1> Manage Subscriptions </h1>
                    <ActionButton onClick={() => this.onToggleUpdatePlan()}>
                      Change Plan
                    </ActionButton>
                  </UpdateContainer>
                </CardTitle>
              </NewCard>
            )}
            {false && (
              <NewCard to={Routes.accountPersonalInfo()}>
                <CardTitle>
                  <UpdateContainer>
                    <h1> Payment Information </h1>
                    <ActionButton onClick={() => this.onToggleUpdatePayment()}>
                      Change Payment Method
                    </ActionButton>
                  </UpdateContainer>
                </CardTitle>

                <FieldLabel> Payment Method </FieldLabel>
                <h1> .... .... .... 4242 </h1>
              </NewCard>
            )}
          </section>
        </CardGrid>
      </Wrapper>
    );
  };

  render() {
    return (
      <div style={{ backgroundColor: '#fafafa' }} className="full-height">
        <Helmet>
          <title>AccountPage</title>
          <meta name="description" content="Description of AccountPage" />
        </Helmet>
        <Switch>
          <Route
            path="/account/calendar/:profileId"
            component={AvailabilityHome}
          />
          <Route path="/account/payment-methods" component={PaymentMethods} />
          <Route path="/account/personal-info" component={PersonalInfo} />
          <Route path="/account/security" component={LoginSecurity} />
          <Route path="/account" component={this.renderAccountHome} />
        </Switch>
      </div>
    );
  }
}

AccountPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  email: PropTypes.string,
};

AccountPage.defaultProps = {
  email: '',
};

const mapStateToProps = createStructuredSelector({
  email: AuthSelectors.getEmail,
  phoneNumber: AuthSelectors.getPhoneNumber,
  name: AuthSelectors.getName,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AccountPage);
