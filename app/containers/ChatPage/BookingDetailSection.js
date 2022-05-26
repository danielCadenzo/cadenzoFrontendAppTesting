import React, { useState } from 'react';
import styled from 'styled-components';
import Label from 'components/Form/Label';
import BookDetailBody from './BookDetailBody';
import BookingDetailSectionForm from './BookingDetailSectionForm';

const BookingDetailsContainer = styled.section`
  -webkit-box-direction: normal !important;
  -webkit-box-orient: vertical !important;
  height: auto !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  transition-property: all !important;
  transition-duration: 0.5s !important;
  transition-delay: 0s !important;
  border-left: 1px solid rgb(235, 235, 235) !important;
  min-width: 375px;
  max-width: 375px;
`;

const BookingDetailTransition = styled.div`
  height: 100% !important;
  width: 100%;
  overflow: hidden !important;
  overflow-y: auto !important;
  opacity: 1 !important;
  transition-duration: 150ms !important;
  transition-delay: 350ms !important;
  font-family: 'Roboto', 'Circular', '-apple-system', 'BlinkMacSystemFont',
    'Helvetica Neue', sans-serif !important;
`;

const Image = styled.img`
  width: 326px;
  height: 163px;
`;

function BookingDetailSection({ channel, activeProfileId }) {
  const {
    business: { name: venueName },
    bookingRequests = [],
  } = channel;
  const bookingRequest = bookingRequests[bookingRequests.length - 1];
  const [isModifyingBooking, setModifyBooking] = useState(false);
  const {
    performer: { name },
    datesSelectable,
    lineupSlot,
    stipulations,
    guarantee,
    revenueSplit,
    revenueSplitAmount,
  } = bookingRequest;

  const handleClickModifyBooking = () => {
    setModifyBooking(!isModifyingBooking);
  };

  return (
    <BookingDetailsContainer>
      <BookingDetailTransition>
        <div className="d-flex full-width flex-column px-3">
          <div className="full-width p-3 border-bottom">
            <b className="f3 roboto">Details</b>
          </div>

          <div className="d-flex flex-column full-width pt-3">
            <p className="h3 roboto pb-3">Booking request from {name}</p>
            <div>
              <Image
                className="rounded-1"
                src="https://via.placeholder.com/250x175"
              />
            </div>
            <div className="d-flex mt-2">
              <Label className="mr-2">Location @</Label>
              <p className="f4 text-bold roboto">{venueName}</p>
            </div>

            {!isModifyingBooking && (
              <BookDetailBody
                onModifyBooking={handleClickModifyBooking}
                bookingRequest={bookingRequest}
              />
            )}
            {isModifyingBooking && (
              <BookingDetailSectionForm
                bookingDetail={bookingRequest}
                onCancel={handleClickModifyBooking}
                activeProfileId={activeProfileId}
              />
            )}
          </div>
        </div>
      </BookingDetailTransition>
    </BookingDetailsContainer>
  );
}

BookingDetailSection.defaultProps = {};

export default BookingDetailSection;
