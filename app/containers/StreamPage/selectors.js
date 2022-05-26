import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the streamPage state domain
 */

const selectStreamPageDomain = state => state.streamPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by StreamPage
 */

const makeSelectStreamPage = () =>
  createSelector(
    selectStreamPageDomain,
    substate => substate,
  );

export default makeSelectStreamPage;
export { selectStreamPageDomain };
