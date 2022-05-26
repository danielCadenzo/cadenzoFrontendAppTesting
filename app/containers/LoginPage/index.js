/**
 *
 * LoginPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { useInjectSaga } from 'utils/injectSaga';
import styled from 'styled-components';
import { eraseCookie } from 'utils/localStorage';
import saga from './saga';
import { AccountBox } from './AccountBox';
import { device } from '../../constants/ResponsiveSizing/deviceSize';
import { BrandingBox } from './BrandingBox';
const LOGIN_PAGE = 'login';
const SIGNUP_PAGE = 'signup';
const FORGOT_PASS_PAGE = 'reset-password';
const SIGNOUT_PAGE = 'signout';
// const RESET_PASSWORD = "accounts/reset"

const pathToRender = page => {
  const { pathname } = window.location;
  const path = pathname.split('/');
  switch (path[1]) {
    case LOGIN_PAGE:
      return LOGIN_PAGE;
    case SIGNUP_PAGE:
      return SIGNUP_PAGE;
    case FORGOT_PASS_PAGE:
      return FORGOT_PASS_PAGE;
    case SIGNOUT_PAGE:
      return SIGNOUT_PAGE;
    default:
      return LOGIN_PAGE;
  }
};

const il8n = key => `app.containers.LoginPage.${key}`;

const AppContainer = styled.div`
  //width: 100%;
  //height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;

  @media ${device.laptop} {
    background: linear-gradient(58deg, #5926cc 20%, #a84bf5 100%);
  }
`;

const NOTIFICATION_REASONS = Object.freeze({
  RECEIVE_TICKET: 'receive_ticket',
});
export function LoginPage(props) {
  useInjectSaga({ key: 'loginPage', saga });

  const path = pathToRender();
  const { dispatch } = props;
  if (path === SIGNOUT_PAGE) {
    eraseCookie('authtoken');
    return <Redirect to={`/${LOGIN_PAGE}`} />;
  }

  return (
    <AppContainer>
      {/** props.isLoggedIn && <Redirect to="/" /> */}

      <AccountBox dispatch={dispatch} defaultPath={pathToRender} />
      <BrandingBox />
    </AppContainer>
  );
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.authReducer.loggedIn,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(LoginPage);
