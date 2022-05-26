/* eslint-disable no-param-reassign */
import produce from 'immer';
import { FOLLOW_EVENT, UNFOLLOW_EVENT } from '../ActionTypes';

const favoriteEvents = (state = {}, action) =>
  produce(state, () => {
    switch (action.type) {
      case FOLLOW_EVENT: {
        const { payload } = action;
        const { eventId } = payload;
        return {
          ...state,
          [eventId]: true,
        };
      }
      case UNFOLLOW_EVENT: {
        const { payload } = action;
        const { eventId } = payload;
        if (state.hasOwnProperty[eventId]) {
          delete state[eventId];
        }
        return {
          ...state,
        };
      }
      default:
        return state;
    }
  });

export default favoriteEvents;
