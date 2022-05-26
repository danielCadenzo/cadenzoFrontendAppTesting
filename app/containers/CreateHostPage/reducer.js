/*
 *
 * CreateArtistPage reducer
 *
 */
import produce from 'immer';
import { UNINITIALIZED } from 'redux/RequestStates';
import { CREATE_VENUE, EDIT_VENUE } from './constants';

export const initialState = {
  requestStatus: UNINITIALIZED,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case EDIT_VENUE:
      case CREATE_VENUE: {
        return {
          ...state,
          requestStatus: action.meta.status,
        };
      }
    }
    return state;
  });

export default reducer;
