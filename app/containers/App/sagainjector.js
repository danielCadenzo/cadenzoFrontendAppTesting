import { useInjectSaga } from 'utils/injectSaga';
import dashboardSaga from 'data/sagas/dashboard_saga';
import React, { memo } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

/**
 * Injects any global sagas
 */
function GlobalInjector() {
  useInjectSaga({ key: 'dashboard', saga: dashboardSaga });
  return <></>;
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
)(GlobalInjector);
