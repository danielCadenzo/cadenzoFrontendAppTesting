import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createArtistPage state domain
 */

const selectCreateArtistPageDomain = state =>
  state.createArtistPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateArtistPage
 */

const makeSelectCreateArtistPage = () =>
  createSelector(
    selectCreateArtistPageDomain,
    substate => substate,
  );

export default makeSelectCreateArtistPage;
export { selectCreateArtistPageDomain };
