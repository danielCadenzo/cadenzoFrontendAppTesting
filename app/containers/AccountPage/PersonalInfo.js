import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import Button from 'components/Button';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { compose } from 'redux';
import * as AuthSelectors from 'data/selectors/authSelectors';
import { createStructuredSelector } from 'reselect';
import { createGQLQuery } from 'data/api';
import { fetchLoggedInUserAction } from 'data/sagas/dashboard_saga';
import {
  VERIFY_NEW_PHONE_NUMBER,
  REQUEST_NEW_PHONE_NUMBER_2FA,
  UPDATE_PROFILE,
} from './queries';

const ColoredLink = styled(Link)`
  color: #1d82a5;
`;

const SubmitButton = styled(Button)`
  padding: 15px;
`;

function PhoneInputComponent(props) {
  const { component: Component, inputRef, ...other } = props;

  // implement `InputElement` interface
  React.useImperativeHandle(inputRef, () => ({
    focus: () => {
      // logic to focus the rendered component from 3rd party belongs here
    },
    // hiding the value e.g. react-stripe-elements
  }));

  // `Component` will be your `SomeThirdPartyComponent` from below
  return <NumberFormat format="+1 (###) ###-####" mask="_" {...other} />;
}

const ErrorText = styled.p`
  color: #d56b3e;
`;

class PersonalInfo extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    const { email = '', phoneNumber = '', name = '' } = props;

    this.state = {
      formErrors: false,
      showPhoneError: false,
      email,
      phoneNumber,
      name,
      verifyButtonClicked: false,
      code2fa: '',
    };
  }

  updateForm = newState => {
    this.setState({ ...newState });
  };

  isValidEmail = () => {
    const { email } = this.state;
    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return re.test(String(email).toLowerCase());
  };

  onSaveProfile = () => {
    const { formErrors, showPhoneError, email, name } = this.state;
    if (this.isValidEmail() && !formErrors && !showPhoneError) {
      createGQLQuery(UPDATE_PROFILE, { name, email });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  onVerifyClick = () => {
    this.setState({ verifyButtonClicked: true });
  };

  handleRequest2faCode = () => {
    const { phoneNumber } = this.state;
    createGQLQuery(REQUEST_NEW_PHONE_NUMBER_2FA, { phoneNumber });
  };

  handleVerify2faCode = () => {
    const { phoneNumber, code2fa } = this.state;
    createGQLQuery(VERIFY_NEW_PHONE_NUMBER, {
      phoneNumber,
      code: code2fa,
    }).then(data => {
      const { viewer } = data;
      if (viewer && viewer.verify2faCode) {
        this.setState({ verifyButtonClicked: false });
        this.props.dispatch(fetchLoggedInUserAction());
      }
    });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.email !== prevProps.email ||
      this.props.phoneNumber !== prevProps.phoneNumber
    ) {
      const { email, phoneNumber, name } = this.props;
      this.updateForm({ email, phoneNumber, name });
    }
  }

  updateFormValues = evt => {
    const {
      target: { value, name },
    } = evt;
    if (name === 'phoneNumber' && value.includes('_')) {
      this.setState({ showPhoneError: true, [name]: value });
      return;
    }
    if (name === 'phoneNumber' && !value.includes('_')) {
      this.setState({ showPhoneError: false, [name]: value });
      return;
    }
    this.setState({ [name]: value });
  };

  render() {
    const {
      is2faEnabled,
      phoneNumber: propsPhoneNumber,
      email: userEmail,
    } = this.props;
    const {
      showPhoneError,
      email,
      phoneNumber,
      name,
      verifyButtonClicked,
    } = this.state;
    const needToVerifyNum = propsPhoneNumber !== phoneNumber;
    const emailIsValid = this.isValidEmail();
    return (
      <div className="container-sm full-height mt-4 d-flex flex-column">
        <div className="d-flex flex-column">
          <div className="d-flex my-3 flex-column">
            <TextField
              label="Name"
              onChange={this.updateFormValues}
              value={name}
              name="name"
              placeholder="Name"
              variant="outlined"
              margin="normal"
            />
          </div>

          <div className="d-flex mt-2 flex-column">
            <TextField
              label="Email"
              type="email"
              error={!emailIsValid}
              defaultValue={userEmail}
              value={email}
              name="email"
              onChange={this.updateFormValues}
              helperText={emailIsValid ? '' : 'Invalid Email'}
              placeholder="Email"
              variant="outlined"
              margin="normal"
            />
          </div>

          <div className="d-flex flex-column mt-3">
            <div className="d-flex flex-justify-between">
              <TextField
                name="phoneNumber"
                label="Phone Number"
                onChange={this.updateFormValues}
                defaultValue={propsPhoneNumber}
                value={phoneNumber}
                variant="outlined"
                margin="normal"
                InputProps={{
                  inputProps: {
                    component: (
                      <NumberFormat format="+1 (###) ###-####" mask="_" />
                    ),
                  },
                  inputComponent: PhoneInputComponent,
                }}
              />
              {needToVerifyNum && (
                <SubmitButton onClick={this.handleRequest2faCode}>
                  Verify Number
                </SubmitButton>
              )}
            </div>

            {needToVerifyNum && verifyButtonClicked && (
              <div className="d-flex">
                <TextField
                  onChange={this.updateFormValues}
                  name="code2fa"
                  placeholder="Auth Code"
                  className="mr-3"
                />
                <ColoredLink
                  onKeyDown={this.handleSend2faCode}
                  onClick={this.handleSend2faCode}
                >
                  Resend Auth Code
                </ColoredLink>
              </div>
            )}

            {showPhoneError && (
              <ErrorText>
                Must enter a full phone number & verify it.{' '}
              </ErrorText>
            )}
          </div>
        </div>
        <SubmitButton className="full-width" onClick={this.onSaveProfile}>
          Save
        </SubmitButton>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  is2faEnabled: AuthSelectors.getIs2faEnabled,
  email: AuthSelectors.getEmail,
  phoneNumber: AuthSelectors.getPhoneNumber,
  name: AuthSelectors.getName,
});

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: () => dispatch(fetchLoggedInUserAction),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(PersonalInfo);
