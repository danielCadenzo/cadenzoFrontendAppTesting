import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { post } from 'data/api';
import Routes from 'data/Routes';
import { redirectToUrl } from 'utils/helpers';
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

const MIN_PASSWORD_SIZE = 6;

const PasswordResetForm = props => {
  const { switchToSignin } = useContext(AccountContext);
  const [formFields, handleFormFields] = useState({
    pswrd: '',
    pswrd1: '',
  });
  const [showEmailResetRequestSent, setShowSent] = useState(false);
  const pswrdsAreSame = formFields.pswrd !== formFields.pswrd1;

  const onSubmit = e => {
    if (
      formFields.pswrd.length > MIN_PASSWORD_SIZE &&
      formFields.pswrd === formFields.pswrd1
    ) {
      const url = `${window.location.pathname.substring(1)}`;
      post(url, formFields).then(response => {
        if (response && response.success) {
          redirectToUrl(Routes.login());
        }
      });
    }
  };

  return (
    <BoxContainer>
      <FormContainer onSubmit={onSubmit}>
        {pswrdsAreSame && formFields.pswrd.length < MIN_PASSWORD_SIZE && (
          <p className="text-red text-bold"> </p>
        )}
        {pswrdsAreSame && (
          <p className="text-red text-bold"> Passwords must match and have more than 6 characters.</p>
        )}
        <Input
          className="p-2"
          alt="Enter new password"
          rel="password"
          placeholder="Enter new password"
          onChange={e =>
            handleFormFields({ ...formFields, pswrd: e.target.value })
          }
        />

        <Input
          className="p-2"
          alt="Confirm new password"
          rel="password"
          placeholder="Confirm new password"
          onChange={e =>
            handleFormFields({ ...formFields, pswrd1: e.target.value })
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

PasswordResetForm.propTypes = {};

export default memo(PasswordResetForm);
