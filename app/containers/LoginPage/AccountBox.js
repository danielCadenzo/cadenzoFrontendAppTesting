import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { AccountContext } from './accountContext';
import { SignupForm } from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import PasswordResetForm from './PasswordResetForm';
import { device } from '../../constants/ResponsiveSizing/deviceSize';

const BoxContainer = styled.div`
  width: 280px;
  height: 580px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;

  @media ${device.laptop} {
    //position: absolute;
    //left: 0;
    //width: 45%;
    height: 100%;
    border-radius: 0px;
    flex-shrink: 0; /* shrinks to 0 to apply 70% width*/
    flex-basis: 50%; /* sets initial width to 70% */
}
  }
`;

const TopContainer = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em;
  padding-bottom: 5em;
  position: relative;

  @media ${device.laptop} {
    padding-bottom: 1em;
  }
`;

const BackDrop = styled(motion.div)`
  width: 160%;
  height: 550px;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  transform: rotate(60deg);
  top: -290px;
  left: -70px;
  background: #5926cc;
  background: linear-gradient(58deg, #5926cc 20%, #a84bf5 100%);
  @media ${device.laptop} {
    display: none;
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.h2`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 10;
  margin: 0;

  @media ${device.laptop} {
    font-size: 4vw;
    color: #5926cc;
  }
`;

const SmallText = styled.h5`
  color: #fff;
  font-weight: 500;
  font-size: 11px;
  z-index: 10;
  margin: 0;
  margin-top: 7px;
  @media ${device.laptop} {
    font-size: 1.1vw;
    margin-left: 8px;
    color: #5926cc;
  }
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.8em;
`;

const backdropVariants = {
  expanded: {
    width: '233%',
    height: '1050px',
    borderRadius: '20%',
    transform: 'rotate(60deg)',
  },
  collapsed: {
    width: '160%',
    height: '550px',
    borderRadius: '50%',
    transform: 'rotate(60deg)',
  },
};

const expandingTransition = {
  type: 'spring',
  duration: 2.3,
  stiffness: 30,
};

const ANIMATION_TIMER = 400;

export function AccountBox({ dispatch }) {
  const [isExpaneded, setExpanded] = useState(false);
  const [active, setActive] = useState('signin');
  const playExpandingAnimation = () => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, expandingTransition.duration * 1000 - 1500); // Converts secs to ms
  };

  const switchToSignup = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive('signup');
    }, ANIMATION_TIMER);
  };
  const switchToSignin = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive('signin');
    }, ANIMATION_TIMER);
  };

  const switchToForgotPassword = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive('forgotpassword');
    }, ANIMATION_TIMER);
  };

  const contextValue = {
    switchToSignup,
    switchToSignin,
    switchToForgotPassword,
  };

  const LoginFormWithDispatch = () => <LoginForm dispatch={dispatch} />
  const SignupFormWithDispatch = () => <SignupForm dispatch={dispatch} />

  return (
    <AccountContext.Provider value={contextValue}>
      <BoxContainer>
        <TopContainer>
          <BackDrop
            initial={false}
            animate={isExpaneded ? 'expanded' : 'collapsed'}
            variants={backdropVariants}
            transition={expandingTransition}
          />
          {active === 'signin' && (
            <HeaderContainer>
              <HeaderText>Welcome to </HeaderText>
              <HeaderText>Cadenzo!</HeaderText>
              <SmallText>Sign in and start booking!</SmallText>
            </HeaderContainer>
          )}
          {active === 'signup' && (
            <HeaderContainer>
              <HeaderText>Create </HeaderText>
              <HeaderText>Account!</HeaderText>
              <SmallText>Sign up and start booking!</SmallText>
            </HeaderContainer>
          )}
          {active === 'forgotpassword' && (
            <HeaderContainer>
              <HeaderText>Forgot </HeaderText>
              <HeaderText>Password?</HeaderText>
              <SmallText>Enter your account email!</SmallText>
            </HeaderContainer>
          )}
        </TopContainer>
        <InnerContainer>
          <Switch>
            <Route path="/signup" component={SignupFormWithDispatch} />
            <Route exact path="/login" component={LoginFormWithDispatch} />
            <Route path="/reset-password" component={ForgotPasswordForm} />
            <Route
              path="/accounts/reset/:uid/:token"
              component={PasswordResetForm}
            />
          </Switch>
        </InnerContainer>
      </BoxContainer>
    </AccountContext.Provider>
  );
}

AccountBox.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
