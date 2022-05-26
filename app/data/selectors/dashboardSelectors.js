'use es6';

import { initialState } from 'data/reducers/dashboard_reducer';
import { createSelector } from 'reselect';

export const getDashboard = state => state.dashboard || initialState;

export const getCancelledBookingsById = state =>
  state.dashboard.cancelledBookingsById;
export const getConfirmedBookingsById = state =>
  state.dashboard.confirmedBookingsById;
export const getBookingRequestsById = state =>
  state.dashboard.bookingRequestsById;

export const getCancelledBookings = createSelector(
  [getDashboard],
  state => Object.values(state.cancelledBookingsById),
);

export const getConfirmedBookings = createSelector(
  [getDashboard],
  state => Object.values(state.confirmedBookingsById),
);

export const getBookingRequests = createSelector(
  [getDashboard],
  state => Object.values(state.bookingRequestsById),
);