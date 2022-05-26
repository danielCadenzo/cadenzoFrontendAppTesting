import produce from 'immer';
import { combineReducers } from 'redux';
import {
  SELECTED_EVENT_RECEIVED,
  SET_SELECTED_TICKET_GROUP,
  ADD_TICKET_GROUP_HOLDER,
  UPDATE_TICKET_GROUP_HOLDER,
  UPDATE_PUBLISH_STATE,
  DELETE_TICKET_GROUP_HOLDER,
} from '../ActionTypes';

const selectedEvent = (state = null, action) =>
  produce(state, () => {
    switch (action.type) {
      case SELECTED_EVENT_RECEIVED: {
        const { payload } = action;
        return payload;
      }
      case UPDATE_PUBLISH_STATE: {
        const {
          payload: { publishState },
        } = action;
        if (state) {
          return {
            ...state,
            event: {
              ...state.event,
              isPublic: publishState,
            },
          };
        }
        return state;
      }
      default:
        return state;
    }
  });

const selectedTicketGroup = (state = null, action) =>
  produce(state, () => {
    switch (action.type) {
      case SET_SELECTED_TICKET_GROUP: {
        const { payload } = action;
        return payload;
      }
      default:
        return state;
    }
  });

// These represent changes yet to be committed to ticket group
const ticketGroupHolds = (state = {}, action) =>
  produce(state, () => {
    switch (action.type) {
      case ADD_TICKET_GROUP_HOLDER: {
        const { payload } = action;
        const { email } = payload;
        return { ...state, [email]: payload };
      }
      case DELETE_TICKET_GROUP_HOLDER:
      case UPDATE_TICKET_GROUP_HOLDER: {
        const { payload } = action;
        const { email } = payload;
        // eslint-disable-next-line no-param-reassign
        state[email] = payload;
        return { ...state };
      }
      default:
        return state;
    }
  });

export default combineReducers({
  selectedEvent,
  selectedTicketGroup,
  ticketGroupHolds,
});
