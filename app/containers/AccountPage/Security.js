import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormLabel, TextField } from '@material-ui/core';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import * as AuthSelectors from 'data/selectors/authSelectors';
import { Link } from 'react-router-dom';
import Routes from 'data/Routes';
import { createGQLQuery } from 'data/api';
import * as AuthActions from 'data/actions/AuthActions';
import Button from 'components/Button';
import { UPDATE_PASSWORD, VERIFY_2FA_CODE, REQUEST_2FA_CODE } from './queries';

const StyledButton = styled(Button)`
  background-color: #22af9a !important;
  color: white !important;
`;

const ColoredLink = styled(Link)`
  color: #1d82a5;
`;

const ErrorText = styled.p`
  color: #d56b3e;
`;

class LoginSecurity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is2faEnabled: false,
      isTesting2fa: false,
      code2fa: '',
      isChangingPassword: false,
      showPasswordError: false,
      passwordErrorMsg: '',
      confirmPass: '',
      newPass: '',
      confirmNewPass: '',
    };
  }

  handleSubmitPasswordForm = () => {
    const { confirmNewPass, confirmPass, newPass } = this.state;
    createGQLQuery(UPDATE_PASSWORD, {
      confirmNewPass,
      newPass,
      confirmPass,
    }).then(data => {
      const { resetPassword = null } = data;
      if (resetPassword) {
        if (resetPassword.success) {
          this.setState({ isChangingPassword: false });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        if (!resetPassword.success) {
          this.setState({
            passwordErrorMsg: resetPassword.msg,
            showPasswordError: true,
          });
        }
      } else {
        this.setState({
          passwordErrorMsg: 'Error, could not process password reset',
          showPasswordError: true,
        });
      }
    });
  };

  enableTesting2fa = () => this.setState({ isTesting2fa: true });

  toggleIsChangingPassword = () => {
    const { isChangingPassword } = this.state;
    this.setState({
      isChangingPassword: !isChangingPassword,
    });
  };

  handleRequest2faCode = () => {
    createGQLQuery(REQUEST_2FA_CODE);
  };

  handleVerify2faCode = () => {
    const { code2fa } = this.state;
    createGQLQuery(VERIFY_2FA_CODE, {
      code: code2fa,
      enableTwoFactor: true,
    }).then(data => {
      const { viewer } = data;
      if (viewer && viewer.verify2faCode) {
        this.setState({ is2faEnabled: true, isTesting2fa: false });
        this.props.fetchUser();
      } else {
        this.setState({ is2faEnabled: false });
      }
    });
  };

  updatePasswordForm = evt => {
    const {
      target: { value, name },
    } = evt;
    this.setState({ [name]: value });
  };

  render2faField = () => {
    const { isTesting2fa } = this.state;
    const { is2faEnabled } = this.props;
    if (isTesting2fa) {
      return (
        <div className="d-flex flex-column">
          <div className="d-flex">
            <TextField
              onChange={this.updatePasswordForm}
              name="code2fa"
              placeholder="Auth Code"
              className="mr-3"
            />
            <StyledButton
              onClick={this.handleVerify2faCode}
              variant="contained"
            >
              Verify
            </StyledButton>
          </div>
          <ColoredLink
            onKeyDown={this.handleRequest2faCode}
            onClick={this.handleRequest2faCode}
          >
            Resend Auth Code
          </ColoredLink>
        </div>
      );
    }
    return is2faEnabled ? (
      <p>Enabled</p>
    ) : (
      <div>
        <Button onClick={this.enableTesting2fa} variant="contained">
          Enable
        </Button>
      </div>
    );
  };

  render() {
    const {
      showPasswordError,
      isChangingPassword,
      passwordErrorMsg,
    } = this.state;

    return (
      <div className="container-sm full-height mt-4 d-flex flex-column">
        <div className="d-flex flex-column mt-4">
          <div className="d-flex flex-column">
            {showPasswordError && <ErrorText>{passwordErrorMsg}</ErrorText>}
            <TextField
              onChange={this.updatePasswordForm}
              name="confirmPass"
              className="my-2"
              type="password"
              label="Current Password"
              variant="outlined"
              margin="normal"
            />
            <Link to={Routes.passwordReset()} style={{ color: '#1D82A5' }}>
              Forgot your password?
            </Link>
            <TextField
              onChange={this.updatePasswordForm}
              name="newPass"
              className="my-2"
              type="password"
              label="New Password"
              variant="outlined"
              margin="normal"
            />
            <TextField
              onChange={this.updatePasswordForm}
              name="confirmNewPass"
              className="my-2"
              type="password"
              label="Confirm New Password"
              variant="outlined"
              margin="normal"
            />
            <div>
              <Button
                onClick={this.handleSubmitPasswordForm}
                onKeyDown={this.handleSubmitPasswordForm}
                className="full-width mt-3"
                variant="contained"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column mt-4">
          <FormLabel className="h4 mb-2">2-Factor Authentication</FormLabel>
          {this.render2faField()}
        </div>
      </div>
    );
  }
}

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

export default compose(withConnect)(LoginSecurity);
