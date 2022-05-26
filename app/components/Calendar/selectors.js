import { createSelector } from 'reselect';
import { SUCCEEDED } from 'redux/RequestStates';
import { initialState } from './reducer';

/**
 * Direct selector to the discoveryPage state domain
 */

const selectBookingCalendarDomain = state =>
  state.bookingCalendar || initialState;

/**
 * Other specific selectors
 */

export const getCalendarByDate = createSelector(
  selectBookingCalendarDomain,
  state => state.calendarByDate,
);

export const getRequestStatus = createSelector(
  selectBookingCalendarDomain,
  state => state.requestStatus,
);

export const getAvailabilityForProfile = (state, profileId) => {
  const bookingCalendar = getCalendarByDate(state)[profileId];
  return bookingCalendar;
};

export const getRequestStatusByProfileId = (state, profileId) => {
  const requestStatuses = getRequestStatus(state)[profileId] || {};
  delete requestStatuses.timestamp;
  return Object.values(requestStatuses).every(req => req === SUCCEEDED);
};

export const getRequestState = (state, profileId) =>
  createSelector(
    [getRequestState],
    memoized => {
      if (!state.bookingCalendar) return false;
      return getRequestStatusByProfileId(state, profileId);
    },
  );
