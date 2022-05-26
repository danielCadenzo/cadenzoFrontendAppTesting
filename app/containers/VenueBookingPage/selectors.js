import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the venueBookingPage state domain
 */

const selectVenueBookingPageDomain = state =>
  state.venueBookingPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by VenueBookingPage
 */

const makeSelectVenueBookingPage = () =>
  createSelector(
    selectVenueBookingPageDomain,
    substate => substate,
  );

export default makeSelectVenueBookingPage;
export { selectVenueBookingPageDomain };
