import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the landingPage state domain
 */

const selectLandingPageDomain = state => state.landingPage || initialState;

export const getViewableEvents = state => state.landingPage.events;

/**
 * Other specific selectors
 */
/**
 * Default selector used by LandingPage
 */

export const makeSelectLandingPage = () =>
  createSelector(
    selectLandingPageDomain,
    substate => console.log(substate),
  );

export const selectEvents = () =>
  createSelector(
    getViewableEvents,
    substate => console.log(substate),
  );

export default makeSelectLandingPage;
export { selectLandingPageDomain };
