/**
 *
 * NotificationProvider
 * Manages and displays notifications
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import styled from 'styled-components';
import { getNotifications } from './selectors';
import reducer from './reducer';
import { size } from '../../constants/ResponsiveSizing/deviceSize';

const Notification = styled.div`
  border: 2px solid #eeeeee;
  box-sizing: border-box;
  border-radius: 8px;
  color: black;
  width: 300px;
  background: #ffeb81;
  padding: 12px;
  top: 100px;
  z-index: 3;
  ${({ type }) => {
    switch (type) {
      case 'info':
        return 'background: #8183ff;';
      case 'warning':
        return 'background: #ff8181 !important;';
      case 'error':
        return 'background: #f1f1f1;';
      default:
        return 'background: #8183ff;';
    }
  }}

  @media(max-width: ${size.tablet}){
    top: 0px !important;
    right: 15px !important;
  }
`;

const Container = styled.div`
  position: absolute;
  top: 90px;
  z-index: 5;
  right: 20px;
`;

function NotificationProvider({ children, notfications }) {
  useInjectReducer({ key: 'notifications', reducer });
  return (
    <>
      <Container>
        {notfications.map(notif => (
          <Notification {...notif} className="work-sans">
            <h3 className="f4 text-bold"> {notif.header}</h3>
            <p> {notif.message}</p>
          </Notification>
        ))}
      </Container>
      {children}
    </>
  );
}

const mapStateToProps = state => ({
  notfications: getNotifications(state),
});

const mapDispatchToProps = {};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

NotificationProvider.propTypes = {
  notfications: PropTypes.array,
  children: PropTypes.any,
};

export default compose(
  withConnect,
  memo,
)(NotificationProvider);
