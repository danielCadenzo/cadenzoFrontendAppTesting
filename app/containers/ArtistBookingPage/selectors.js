import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the artistBookingPage state domain
 */

const selectArtistBookingPageDomain = state =>
  state.artistBookingPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ArtistBookingPage
 */

const makeSelectArtistBookingPage = () =>
  createSelector(
    selectArtistBookingPageDomain,
    substate => substate,
  );

export default makeSelectArtistBookingPage;
export { selectArtistBookingPageDomain };
