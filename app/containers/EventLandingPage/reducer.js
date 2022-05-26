/*
 *
 * LandingPage reducer
 *
 */
import produce from 'immer';
import { GET_VIEWABLE_EVENTS } from './constants';

export const initialState = {
  events: [],
};

/* eslint-disable default-case, no-param-reassign */
const landingPageReducer = (state = initialState, action) =>
  produce(state, () => {
    switch (action.type) {
      case GET_VIEWABLE_EVENTS:
        const { events } = action;
        return { ...state, events };
        break;
    }
  });

export default landingPageReducer;
