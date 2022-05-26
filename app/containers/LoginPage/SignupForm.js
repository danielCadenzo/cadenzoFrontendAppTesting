import React, { useContext, useState, memo } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getJsonFromUrl } from 'utils/helpers';
import OpenEye from '@material-ui/icons/Visibility';
import ClosedEye from '@material-ui/icons/VisibilityOff';
import styled from 'styled-components';
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
import { signupUserAction } from './saga';
import ErrorMessageText from './ErroMessageText';
import messages from './messages';


export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);
  const [urlParams, _setParams] = useState(getJsonFromUrl());
  const [formFields, handleFormFields] = useState({
    email: urlParams.email || '',
    password1: '',
    password2: '',
    phoneNumber: '',
  });

  const { email, password1, phoneNumber } = formFields;
  const doesPasswordMatch = formFields.password1 === formFields.password2;
  const matcher = phoneNumber.match(/\d/g);
  const phoneNumberIsValid = matcher && matcher.length === 10;
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const onSubmit = () => {
    const validNumber = `+1${matcher.join('')}`;
    if (
      doesPasswordMatch &&
      email !== '' &&
      password1 !== '' &&
      phoneNumber !== '' &&
      phoneNumberIsValid
    ) {
      props.dispatch(
        signupUserAction(formFields.email, formFields.password1, validNumber),
      );
    }
  };

  const VisibilityContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: -30px;
    margin-right: 10px;
    z-index: 2;
  `;

  return (
    <BoxContainer>
      <Helmet>
        <title>Cadenzo | Signup</title>
        <meta name="description" content="Log into Cadenzo" />
      </Helmet>
      {props.displayErrorMessage && (
        <ErrorMessageText className="p-2 flex-justify-center">
          <FormattedMessage {...messages.loginErrorText} />
        </ErrorMessageText>
      )}

      <FormContainer>
        <Input
          type="email"
          placeholder="Enter Email"
          value={formFields.email}
          onChange={e =>
            handleFormFields({ ...formFields, email: e.target.value })
          }
        />
        {!phoneNumberIsValid && phoneNumber.length > 0 && (
          <ErrorMessageText className="p-2 flex-justify-center">
            phone number is invalid
          </ErrorMessageText>
        )}
        <Input
          alt="Enter Phone Number"
          type="phone_number"
          placeholder="Enter Phone Number"
          value={formFields.phoneNumber}
          onChange={e =>
            handleFormFields({ ...formFields, phoneNumber: e.target.value })
          }
        />
        {!doesPasswordMatch && (
          <ErrorMessageText className="p-2 flex-justify-center">
            <FormattedMessage {...messages.passwordMatchErrorText} />
          </ErrorMessageText>
        )}
        <Input
          alt="Enter Password"
          type={passwordShown ? 'text' : 'password'}
          placeholder="Enter Password"
          value={formFields.password1}
          onChange={e =>
            handleFormFields({ ...formFields, password1: e.target.value })
          }
        />
        <VisibilityContainer>
          {passwordShown ? (
            <ClosedEye onClick={togglePassword} />
          ) : (
            <OpenEye onClick={togglePassword} />
          )}
        </VisibilityContainer>
        <Input
          type={passwordShown ? 'text' : 'password'}
          alt="Re-nter Password"
          placeholder="Confirm Password"
          value={formFields.password2}
          onChange={e =>
            handleFormFields({ ...formFields, password2: e.target.value })
          }
        />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <SubmitButton role="button" type="submit" onClick={onSubmit}>
        Signup
      </SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink to="/login">
        Already have an account?
        <BoldLink to="/login" onClick={switchToSignin}>
          Signin
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

export default compose(
  withConnect,
  memo,
)(SignupForm);
