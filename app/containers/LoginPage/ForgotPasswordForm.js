import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { isValidEmail } from 'utils/validation';
import { post } from 'data/api';
import {
  BoxContainer,
  FormContainer,
  SubmitButton,
  BoldLink,
  MutedLink,
  Input,
} from './common';
import { Marginer } from '../../components/Marginer';
import { AccountContext } from './accountContext';

const PASSWORD_RESET_ROUTE = 'accounts/forgot-password';

const ForgotPasswordForm = props => {
  const { switchToSignin } = useContext(AccountContext);
  const [formFields, handleFormFields] = useState({
    email: '',
  });
  const [showEmailResetRequestSent, setShowSent] = useState(false);

  const onSubmit = e => {
    if (formFields.email && isValidEmail(formFields.email)) {
      post(PASSWORD_RESET_ROUTE, formFields).then(response => {
        if (response && response.success) {
          setShowSent(true);
        }
      });
    }
  };

  return (
    <BoxContainer>
      <FormContainer onSubmit={onSubmit}>
        {showEmailResetRequestSent && (
          <p> If user with email exists, password reset link sent.</p>
        )}
        <Input
          className="p-2"
          alt="Enter Email"
          rel="email"
          placeholder="Enter Email"
          onChange={e =>
            handleFormFields({ ...formFields, email: e.target.value })
          }
        />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <SubmitButton type="submit" onClick={onSubmit}>
        {' '}
        Submit{' '}
      </SubmitButton>
      <Marginer direction="vertical" margin={10} />
      <MutedLink to="/login">
        Already have an account?
        <BoldLink to="/login" onClick={switchToSignin}>
          Signin
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
};

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func,
  displayErrorMessage: PropTypes.bool,
};

export default memo(ForgotPasswordForm);
