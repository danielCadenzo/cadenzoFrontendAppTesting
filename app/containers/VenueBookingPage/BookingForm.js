/**
 *
 * VenueBookingPage
 *
 */

import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useForm } from 'react-form';
import SendBookingRequestModal from 'containers/ArtistBookingPage/SendBookingRequestModal';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';
import Button from 'components/Button';
import Label from 'components/Form/Label';
import TextField from 'components/Form/TextField';
import { graphql, useMutation } from 'react-relay';
import { getActiveArtistProfile } from 'data/selectors/authSelectors';
import BookingCalendar from 'components/Calendar/BookingCalendar';
import Routes from 'data/Routes';
import ConfirmationCard from 'components/ConfirmationCard';
import { trackEvent } from 'utils/analytics';
import makeSelectVenueBookingPage from './selectors';

const Container = styled.div`
  border: 1px solid rgb(221, 221, 221);
  border-radius: 12px;
  padding: 24px;
  box-shadow: rgb(0 0 0 / 12%) 0px 6px 16px;
`;

const Wrapper = styled.div`
  position: relative !important;
  width: 33.33333333333333% !important;
  margin-left: 8.333333333333332% !important;
  margin-right: 0% !important;
  min-width: 450px;
`;

const SEND_BOOKING_REQUEST = graphql`
  mutation BookingFormMutation(
    $artistId: ID!
    $hostId: ID!
    $startDate: DateTime!
    $endDate: DateTime!
    $message: String!
  ) {
    sendBookingRequest(
      artistId: $artistId
      hostId: $hostId
      startDate: $startDate
      endDate: $endDate
      message: $message
      initiator: ARTIST
    ) {
      success
    }
  }
`;

export function BookingForm({ venue, activeArtistProfile }) {
  const { dailyBookingFee, hourlyBookingFee } = venue;
  const BookingPriceHeader = useMemo(() => {
    if (dailyBookingFee) {
      return <p>{(dailyBookingFee / 100).toFixed(2)}/per day</p>;
    }
    if (hourlyBookingFee) {
      return <p>{(hourlyBookingFee / 100).toFixed(2)}/per hr</p>;
    }
    return null;
  }, []);

  const [commit, isInFlight] = useMutation(SEND_BOOKING_REQUEST);
  const [slotSelected, setSlotSelected] = useState({});
  const [showModal, setShowBookingModal] = useState(false);
  const [confirmed, setConfirmation] = useState(false);

  const showConfirmedBooking = () => {
    setConfirmation(!confirmed);
  };

  const handleSubmit = useCallback(
    values => {
      if (!activeArtistProfile.id) return null;

      commit({
        variables: {
          startDate: slotSelected.startDate.toUTC(),
          endDate: slotSelected.endDate.toUTC(),
          artistId: activeArtistProfile.id,
          hostId: venue.id,
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
    },
    [activeArtistProfile, venue, slotSelected],
  );

  useEffect(() => {
    const artistName = activeArtistProfile && activeArtistProfile.name;
    trackEvent('view_venue_booking_page', {
      artist: artistName,
      venue: venue.name,
    });
  }, []);

  const {
    Form,
    meta: { error, submissionAttempts },
  } = useForm({
    onSubmit: async values => handleSubmit(values),
    debugForm: false,
  });

  const handleSlotSelected = ({ startDate, endDate }, slotInfo) => {
    setSlotSelected({ ...slotInfo, startDate, endDate });
    setShowBookingModal(true);
  };

  const closeSlotSelected = () => {
    setShowBookingModal(false);
  };

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
                subtext="The venue will get back to you quickly"
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

            <h4 className="h4">{BookingPriceHeader} </h4>
            <div className="d-flex flex-column mt-2 full-width mx-auto">
              {!activeArtistProfile && (
                <p style={{ color: 'red' }} className="roboto">
                  You must select an Artist profile to book this venue.
                </p>
              )}
              <div className="d-flex flex-wrap">
                <Label> Select Date: </Label>
                <BookingCalendar
                  useDatePicker
                  creatorId={venue.id}
                  onSlotSelected={handleSlotSelected}
                />
              </div>
            </div>
            <TextField
              placeholder="Enter your message to the venue"
              className="full-width mt-3"
              name="message"
              required
            />
            <div className="full-width d-flex flex-justify-center">
              <Button
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
        {showModal && activeArtistProfile && slotSelected.startDate && (
          <SendBookingRequestModal
            onSaveSuccess={() => {}}
            onCancel={closeSlotSelected}
            slot={slotSelected}
            venueId={activeArtistProfile.id}
            isRequesterAnVenue={false}
            requesteeId={venue.id}
            requesterId={activeArtistProfile.id}
            showConfirmedBooking={showConfirmedBooking}
          />
        )}
      </Container>
    </Wrapper>
  );
}

BookingForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  venueBookingPage: makeSelectVenueBookingPage(),
  activeArtistProfile: getActiveArtistProfile,
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
)(BookingForm);
