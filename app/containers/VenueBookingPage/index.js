
/**
 *
 * VenueBookingPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import { useInjectReducer } from 'utils/injectReducer';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { withRouter } from 'react-router-dom';
import makeSelectVenueBookingPage from './selectors';
import reducer from './reducer';
import MainBody from './MainBody';

const Wrapper = styled.div`
  height: fit-content;
`;

const VENUE_QUERY = graphql`
  query VenueBookingPageQuery($id: ID!) {
    venue(id: $id) {
      id
      socialLinks
      isAssignedSeating
      images
      name
      address {
        raw
        formatted
        longitude
        latitude
      }
      dailyBookingFee
      preferredPerformances
      anemities
      facebookProfile
      instagramProfile
      description
      admins {
        name
      }
      capacity
      exactCapacity
      isVerified
      avatar
    }
  }
`;

export function VenueBookingPage() {
  useInjectReducer({ key: 'venueBookingPage', reducer });
  const venueId = window.location.pathname.split('/').pop();
  const data = useLazyLoadQuery(
    VENUE_QUERY,
    { id: venueId },
    { fetchPolicy: 'store-and-network' },
  );

  return (
    <Wrapper>
      <Helmet>
        <title>Book Venue | Cadenzo</title>
        <meta name="description" content="Book Venue | Cadenzo" />
      </Helmet>
      {data && data.venue && <MainBody venue={data.venue} />}
    </Wrapper>
  );
}

VenueBookingPage.propTypes = {};

const mapStateToProps = createStructuredSelector({
  venueBookingPage: makeSelectVenueBookingPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(VenueBookingPage));
