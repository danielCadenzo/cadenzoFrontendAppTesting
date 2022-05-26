/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.LoginPage';

export default defineMessages({
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'Password',
  },
  submit: {
    id: `${scope}.submit`,
    defaultMessage: 'Submit',
  },
  login: {
    id: `${scope}.login`,
    defaultMessage: 'Login',
  },
  signup: {
    id: `${scope}.signup`,
    defaultMessage: 'Signup',
  },
  needToSignup: {
    id: `${scope}.needToSignup`,
    defaultMessage: "Don't have an account?",
  },
  haveAnAccount: {
    id: `${scope}.needToSignup`,
    defaultMessage: 'Already have an account?',
  },
  forgotPassword: {
    id: `${scope}.forgotPassword`,
    defaultMessage: 'Reset Forgotten Password',
  },
  forgotPasswordHeader: {
    id: `${scope}.forgotPassword`,
    defaultMessage: 'Forgot Password',
  },
  loginErrorText: {
    id: `${scope}.loginErrorText`,
    defaultMessage: 'There was problem with your form submission',
  },
  passwordMatchErrorText: {
    id: `${scope}.passwordMatchErrorText`,
    defaultMessage: 'The passwords do not match',
  },
  reenterPassword: {
    id: `${scope}.reenterPassword`,
    defaultMessage: 'Confirm Password',
  },
  phoneNumber: {
    id: `${scope}.phoneNumber`,
    defaultMessage: 'Phone Number',
  },
  receive_ticket: {
    id: `${scope}.receive_ticket`,
    defaultMessage: 'To receive your ticket sign-in or sign-up!',
  },
});
