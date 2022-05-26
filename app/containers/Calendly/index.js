/**
 *
 * Calendly
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import BookingCalendar from 'components/Calendar/BookingCalendar';
import { withRouter } from 'react-router';
import SendBookingRequestModal from 'containers/ArtistBookingPage/SendBookingRequestModal';
import { connect } from 'react-redux';
import {
  getIsActiveProfileAnVenue,
  getActiveProfile,
  getUserIsLoggedIn,
} from 'data/selectors/authSelectors';
import { createStructuredSelector } from 'reselect';
import { graphql, useLazyLoadQuery } from 'react-relay';
import UIAvatar from 'components/UIAvatar';
import styled from 'styled-components';
import UIMain from '../../components/UiMain/index';
import messages from './messages';

const Container = styled.div`
  max-width: 550px;
`;

const ProfileQuery = graphql`
  query CalendlyQuery($id: ID!) {
    profile(id: $id) {
      __typename
      ... on ArtistNode {
        name
        avatar
      }
      ... on VenueNode {
        name
        avatar
      }
    }
  }
`;
export function Calendly({ match, activeProfile, activeProfileIsVenue }) {
  const {
    params: { profileId },
  } = match;

  const [showModal, setShowBookingModal] = useState(false);
  const [slotSelected, setSlotSelected] = useState({});
  const [nodeType, dbId] = atob(profileId).split(':');
  const isVenueNode = nodeType === 'VenueNode';
  const data = useLazyLoadQuery(ProfileQuery, { id: profileId });
  const {
    profile: { avatar, name },
  } = data;

  const handleSlotSelected = ({ startDate, endDate }, slotInfo) => {
    setSlotSelected({ ...slotInfo, startDate, endDate });
    setShowBookingModal(true);
  };

  const closeSlotSelected = () => {
    setShowBookingModal(false);
  };

  return (
    <UIMain className="full-width full-height d-flex flex-column flex-items-center flex-justify-center">
      <Helmet>
        <title>{name}'s Booking Calendar | Cadenzo</title>
        <meta name="description" content="Booking Page | Cadenzo" />
      </Helmet>
      <div className="d-flex full-width flex-justify-center">
        <h1 className="pl-1 h1 color-primary my-2 text-center">
          {name}
          <FormattedMessage {...messages.header} />
        </h1>
      </div>
      <div className="full-width d-flex pb-3 flex-items-center flex-justify-center">
        <UIAvatar profileName={name} avatarUrl={avatar} />
        <h2 className="pl-1 h2 color-primary">{name}</h2>
      </div>
      <Container>
        <BookingCalendar
          onSlotSelected={handleSlotSelected}
          creatorId={profileId}
          isForVenue={isVenueNode}
        />
        {showModal && slotSelected.startDate && (
          <SendBookingRequestModal
            onSaveSuccess={() => {}}
            onCancel={closeSlotSelected}
            slot={slotSelected}
            venueId={activeProfile.id}
            isRequesterAnVenue={activeProfileIsVenue}
            requesteeId={activeProfileIsVenue ? profileId : activeProfile.id}
            requesterId={activeProfileIsVenue ? activeProfile.id : profileId}
          />
        )}
      </Container>
    </UIMain>
  );
}

Calendly.propTypes = {
  match: PropTypes.object.isRequired,
  activeProfile: PropTypes.object.isRequired,
  activeProfileIsVenue: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isLoggedIn: getUserIsLoggedIn,
  activeProfile: getActiveProfile,
  activeProfileIsVenue: getIsActiveProfileAnVenue,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Calendly));
