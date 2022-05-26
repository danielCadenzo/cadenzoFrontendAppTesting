/*
 *
 * PatronPage reducer
 *
 */
import produce from 'immer';
import { combineReducers } from 'redux';
import { FETCH_SELECTED_EVENT } from './constants';

export const initialState = {
  selectedEvent: null,
};

/* eslint-disable default-case, no-param-reassign */
const selectedEvent = (state = initialState, action) =>
  produce(state, () => {
    switch (action.type) {
      case FETCH_SELECTED_EVENT:
        const { result } = action;
        return { ...state, selectedEvent: result };
      default:
        return state;
    }
  });

const selectedTicketGroup = (state = null, action) =>
  produce(state, () => {
    switch (action.type) {
      default:
        return state;
    }
  });

export default combineReducers({
  selectedEvent,
  selectedTicketGroup,
});
