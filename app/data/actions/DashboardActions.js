import { FETCH_BOOKINGS, UPDATE_BOOKING } from 'data/constants';

export const updateBookings = (
  cancelledBookings,
  confirmedBookings,
  bookingRequests,
) => dispatch => {
  dispatch({
    type: FETCH_BOOKINGS,
    payload: {
      cancelledBookings,
      confirmedBookings,
      bookingRequests,
    },
  });
};

export const updateIndividualBooking = (
  bookingInfo,
  bookingActionType,
) => dispatch => {
  dispatch({
    type: UPDATE_BOOKING,
    payload: {
      bookingInfo,
      bookingActionType,
    },
  });
};
