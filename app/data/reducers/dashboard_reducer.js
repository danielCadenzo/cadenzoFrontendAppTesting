import produce from 'immer';
import { FETCH_BOOKINGS, UPDATE_BOOKING } from 'data/constants';
import BookingRequestActions from 'constants/BookingRequestActions';

/**
 * For the home dashboard
 */
export const initialState = {
  cancelledBookingsById: {},
  confirmedBookingsById: {},
  bookingRequestsById: {},
};

const reduceBookingById = bookings =>
  bookings.reduce((byId, booking) => {
    // eslint-disable-next-line no-param-reassign
    byId[booking.node.id] = booking.node;
    return byId;
  }, {});

/* eslint-disable default-case, no-param-reassign */
const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOOKINGS: {
      const {
        cancelledBookings,
        confirmedBookings,
        bookingRequests,
      } = action.payload;
      return {
        cancelledBookingsById: reduceBookingById(cancelledBookings),
        confirmedBookingsById: reduceBookingById(confirmedBookings),
        bookingRequestsById: reduceBookingById(bookingRequests),
      };
    }
    case UPDATE_BOOKING: {
      const newState = { ...state };
      const { bookingInfo, bookingActionType } = action.payload;

      if (
        bookingActionType === BookingRequestActions.CANCEL ||
        bookingActionType === BookingRequestActions.DECLINE ||
        bookingActionType === BookingRequestActions.ACCEPT
      ) {
        delete newState.bookingRequestsById[bookingInfo.id];

        if (bookingActionType === BookingRequestActions.CANCEL) {
          newState.cancelledBookingsById[bookingInfo.id] = bookingInfo;
          delete newState.confirmedBookingsById[bookingInfo.id];
        }
        if (bookingActionType === BookingRequestActions.ACCEPT)
          newState.confirmedBookingsById[bookingInfo.id] = bookingInfo;
      } else {
        newState.bookingRequestsById[bookingInfo.id] = {
          ...newState.bookingRequestsById[bookingInfo.id],
          ...bookingInfo,
        };
      }

      return newState;
    }
    default:
      return state;
  }
};

export default dashboardReducer;
