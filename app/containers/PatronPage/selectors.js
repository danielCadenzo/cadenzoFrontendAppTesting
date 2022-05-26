import { createSelector } from 'reselect';

/**
 * Direct selector to the patronPage state domain
 */

const selectPatronPageDomain = state => state.patronPage;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PatronPage
 */

const makeSelectPatronPage = () =>
  createSelector(
    selectPatronPageDomain,
    substate => substate,
  );

export default makeSelectPatronPage;
export { selectPatronPageDomain };
