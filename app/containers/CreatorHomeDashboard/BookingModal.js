import React from 'react';
import PropTypes from 'prop-types';
import BookingRequestActions from 'constants/BookingRequestActions';
import { updateIndividualBooking } from 'data/actions/DashboardActions';
import BookingStatus from 'constants/BookingStatus';
import { fromServerTime } from 'utils/dates';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import * as AuthSelectors from 'data/selectors/authSelectors';
import * as BookingTypes from 'constants/BookingTypes';
import BookingRequestCard from './BookingRequestCard';
import BookingEditForm from './BookingEditForm';

export function BookingModal({
  activeProfile,
  isOpen,
  onConfirm,
  onClose,
  booking,
  venueId,
  readOnly,
  isCancelled,
  updateBooking,
}) {
  // We can verify the actions available
  const bookingType = booking.status
    ? BookingTypes.REQUEST
    : BookingTypes.CONFIRMED;

  const isBooking = bookingType === BookingTypes.CONFIRMED;

  const isReadyOnly =
    readOnly || booking.status === BookingStatus.ACCEPTED || isBooking;

  // was this the last user to update the booking

  const hasBookingHappened =
    fromServerTime(booking.startDate) < new DateTime.now();

  let availableActions = [];
  if (!hasBookingHappened || (isBooking && !booking.isCancelled)) {
    if (isBooking) {
      availableActions.push(BookingRequestActions.CANCEL);
    } else if (
      bookingType === BookingTypes.REQUEST &&
      booking.status === BookingStatus.PENDING &&
      activeProfile.rId === booking.lastUpdatedBy.id
    ) {
      availableActions = [
        BookingRequestActions.MODIFY,
        BookingRequestActions.DECLINE,
      ];
    } else if (
      bookingType === BookingTypes.REQUEST &&
      booking.status === BookingStatus.PENDING
    ) {
      availableActions = [
        BookingRequestActions.ACCEPT,
        BookingRequestActions.MODIFY,
        BookingRequestActions.DECLINE,
      ];
    }
  }

  return (
    <BookingRequestCard
      isOpen={isOpen}
      header="Booking Request"
      onClose={onClose}
      booking={booking}
    >
      <div>{booking.avatar}</div>

      <BookingEditForm
        bookingDetail={booking}
        venueId={venueId}
        availableActions={availableActions}
        activeProfile={activeProfile}
        onCancel={onClose}
        onSaveSucess={onConfirm}
        updateBooking={updateBooking}
        readOnly={isReadyOnly}
        onClose={onClose}
        isCancelled={isCancelled}
      />
    </BookingRequestCard>
  );
}

BookingModal.defaultProps = {
  readOnly: true,
};

BookingModal.propTypes = {
  activeProfile: PropTypes.object,
  booking: PropTypes.object,
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  venueId: PropTypes.string,
  readOnly: PropTypes.bool,
  isCancelled: PropTypes.bool,
  updateBooking: PropTypes.func,
};

const mapStateToProps = state => ({
  activeProfile: AuthSelectors.getActiveProfile(state),
});

const mapDispatchToProps = {
  updateBooking: updateIndividualBooking,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingModal);
