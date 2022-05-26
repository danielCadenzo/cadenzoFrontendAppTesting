import React, { useContext, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import ClosedEye from '@material-ui/icons/VisibilityOff';
import OpenEye from '@material-ui/icons/Visibility';
import styled from 'styled-components';
import { loginUserAction } from './saga';
import { Marginer } from '../../components/Marginer';

import {
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
  BoldLink,
} from './common';
import { AccountContext } from './accountContext';

export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const { switchToForgotPassword } = useContext(AccountContext);
  const [formFields, handleFormFields] = useState({
    email: '',
    password: '',
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const isError = useSelector(state => state.authReducer.loginError);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const onSubmit = e => {
    props.dispatch(loginUserAction(formFields.email, formFields.password));
    e.preventDefault();
  };
  const VisibilityContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: -30px;
    margin-right: 10px;
    z-index: 2;
  `;

  const ErrorMessage = styled.h3`
    color: red;
    font-size: 12px;
  `;

  return (
    <BoxContainer onSubmit={onSubmit}>
      <form className="full-width">
        <Input
          type="email"
          placeholder="Email"
          onChange={e =>
            handleFormFields({ ...formFields, email: e.target.value })
          }
        />
        <Input
          type={passwordShown ? 'text' : 'password'}
          placeholder="Password"
          onChange={e =>
            handleFormFields({ ...formFields, password: e.target.value })
          }
        />
        <VisibilityContainer>
          {passwordShown ? (
            <ClosedEye onClick={togglePassword} />
          ) : (
            <OpenEye onClick={togglePassword} />
          )}
        </VisibilityContainer>
        <Marginer direction="vertical" margin={10} />
        {isError && (
          <ErrorMessage>Wrong Combination of Email and Password</ErrorMessage>
        )}
        <MutedLink to="/reset-password" onClick={switchToForgotPassword}>
          Forget your password?
        </MutedLink>
        <Marginer direction="vertical" margin="1em" />
        <SubmitButton type="submit" onClick={onSubmit}>
          {' '}
          Sign in
        </SubmitButton>
      </form>

      <Marginer direction="vertical" margin="1em" />
      <MutedLink to="/signup">
        Don't have an account?
        <BoldLink to="/signup" onClick={switchToSignup}>
          Signup
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function mapStateToProps(state) {
  return {};
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

LoginForm.propTypes = {
  dispatch: PropTypes.func,
};

LoginForm.defaultProps = {};

export default compose(withConnect)(LoginForm);
