import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the reviewPage state domain
 */

const selectReviewPageDomain = state => state.reviewPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ReviewPage
 */

const makeSelectReviewPage = () =>
  createSelector(
    selectReviewPageDomain,
    substate => substate,
  );

export default makeSelectReviewPage;
export { selectReviewPageDomain };
