import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the chatPageJs state domain
 */

const selectChatPageJsDomain = state => state.chatPage || initialState;

/**
 * Other specific selectors
 */

const getChatChannels = () =>
  createSelector(
    [selectChatPageJsDomain],
    chatPage => chatPage,
  );

/**
 * Default selector used by ChatPageJs
 */

const makeSelectChatPageJs = () =>
  createSelector(
    selectChatPageJsDomain,
    substate => substate,
  );

export default makeSelectChatPageJs;
export { selectChatPageJsDomain };
