/**
 *
 * VenueBookingPage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useForm } from 'react-form';
import styled from 'styled-components';
import Button from 'components/Button';
import Routes from 'data/Routes';
import Label from 'components/Form/Label';
import TextField from 'components/Form/TextField';
import { graphql, useMutation } from 'react-relay';
import BookingCalendar from 'components/Calendar/BookingCalendar';
import {
  getIsActiveProfileAnVenue,
  getActiveProfile,
  getUserIsLoggedIn,
} from 'data/selectors/authSelectors';
import { createStructuredSelector } from 'reselect';
import { trackEvent } from 'utils/analytics';
import ConfirmationCard from '../../components/ConfirmationCard';
import SendBookingRequestModal from './SendBookingRequestModal';

const VENUE = 'VENUE';

const Container = styled.div`
  border: 1px solid rgb(221, 221, 221);
  border-radius: 12px;
  padding: 24px;
  box-shadow: rgb(0 0 0 / 12%) 0px 6px 16px;
`;

const Wrapper = styled.div`
  position: relative !important;
  min-width: 350px;
  width: 100% !important;
  background-color: white;
  border-radius: 12px;
`;

const SEND_BOOKING_REQUEST = graphql`
  mutation BookingCalendarMutation(
    $artistId: ID!
    $hostId: ID!
    $message: String!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    sendBookingRequest(
      artistId: $artistId
      hostId: $hostId
      startDate: $startDate
      endDate: $endDate
      initiator: VENUE
      message: $message
    ) {
      success
    }
  }
`;

export function BookingForm({
  artistId,
  activeProfile,
  activeProfileIsVenue,
  artist,
}) {
  const [commit, isInFlight] = useMutation(SEND_BOOKING_REQUEST);
  const [slotSelected, setSlotSelected] = useState({});
  const [showModal, setShowBookingModal] = useState(false);
  const [confirmed, setConfirmation] = useState(false);

  const {
    Form,
    values,
    meta: { error, submissionAttempts },
  } = useForm({
    debugForm: false,
    onSubmit: async () => {},
  });

  const showConfirmedBooking = () => {
    setConfirmation(!confirmed);
  };

  const handleSubmit = () => {
    if (activeProfile.profileType !== VENUE) return;
    if (!slotSelected.startDate || slotSelected.endDate) return;
    commit({
      variables: {
        startDate: slotSelected.startDate,
        endDate: slotSelected.endDate,
        artistId,
        hostId: activeProfile.id,
        message: values.message,
      },
      onCompleted: response => {
        if (
          response &&
          response.sendBookingRequest &&
          response.sendBookingRequest.success
        ) {
          showConfirmedBooking();
        }
      },
    });
  };

  const handleSlotSelected = ({ startDate, endDate }, slotInfo) => {
    setSlotSelected({ ...slotInfo, startDate, endDate });
    setShowBookingModal(true);
  };

  const closeSlotSelected = () => {
    setShowBookingModal(false);
  };

  useEffect(() => {
    trackEvent('view_artist_booking_page', {
      artist: artist.name,
      venue: activeProfile && activeProfile.name,
    });
  }, []);

  return (
    <Wrapper>
      <Container>
        <Form>
          <div>
            {confirmed && (
              <ConfirmationCard
                onClose={showConfirmedBooking}
                isOpen={confirmed}
                header="Your Booking Request Has Been Sent!"
                subtext="The artist will get back to you quickly"
                enableExit
              >
                <a href={Routes.homeDashboard()}>
                  <button type="button">Dashboard</button>
                </a>
                <a href={Routes.chat()}>
                  <button type="button">Chat</button>
                </a>
              </ConfirmationCard>
            )}

            <h4 className="h4"> Booking Form </h4>
            <div className="d-flex flex-column mt-2 full-width mx-auto">
              {!activeProfileIsVenue && (
                <p style={{ color: 'red' }} className="roboto">
                  You must select a Host profile to book this artist.
                </p>
              )}
              <div className="d-flex flex-wrap">
                <Label> Select Dates </Label>
                <BookingCalendar
                  isForVenue={false}
                  creatorId={artistId}
                  useDatePicker
                  onSlotSelected={handleSlotSelected}
                />
              </div>
            </div>
            <TextField
              placeholder="Enter your message"
              className="full-width mt-3"
              name="message"
            />
            <div className="full-width d-flex flex-justify-center">
              <Button
                disabled={!activeProfileIsVenue}
                onClick={() => {
                  handleSubmit();
                }}
                type="submit"
                className="p-3 full-width"
              >
                Request to Book
              </Button>
            </div>
          </div>
        </Form>

        {showModal && activeProfileIsVenue && slotSelected.startDate && (
          <SendBookingRequestModal
            onSaveSuccess={() => {}}
            onCancel={closeSlotSelected}
            slot={slotSelected}
            venueId={activeProfile.id}
            isRequesterAnVenue={activeProfileIsVenue}
            requesteeId={artistId}
            requesterId={activeProfile.id}
            showConfirmedBooking={showConfirmedBooking}
          />
        )}
      </Container>
    </Wrapper>
  );
}

BookingForm.propTypes = {
  artist: PropTypes.object.isRequired,
  artistId: PropTypes.string.isRequired,
  activeProfile: PropTypes.object,
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
)(BookingForm);
