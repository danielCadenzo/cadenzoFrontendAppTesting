/**
 *
 * ArtistBookingPage
 *
 */

import React, { memo, Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import { withRouter } from 'react-router-dom';
import LoadingSpinner from 'components/LoadingSpinner';
import makeSelectArtistBookingPage from './selectors';
import reducer from './reducer';
import MainContent from './MainContent';

export function ArtistBookingPage({ match }) {
  useInjectReducer({ key: 'artistBookingPage', reducer });

  return (
    <div style={{ backgroundColor: '#fafafa' }}>
      <Helmet>
        <title> Booking Page | Cadenzo</title>
        <meta name="description" content="Description of ArtistBookingPage" />
      </Helmet>
      <div className="d-flex flex-column">
        <Suspense fallback={<LoadingSpinner />}>
          <MainContent />
        </Suspense>
      </div>
    </div>
  );
}

ArtistBookingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  artistBookingPage: makeSelectArtistBookingPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(withRouter(ArtistBookingPage));
