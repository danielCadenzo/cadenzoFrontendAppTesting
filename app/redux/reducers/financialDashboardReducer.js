import { combineReducers } from 'redux';
import produce from 'immer';
import {
  FETCHED_TICKET_REVENUE,
  FETCHED_TICKET_REVENUE_BY_TICKET_GROUP,
} from '../ActionTypes';

const ticketRevenue = (state = [], action) =>
  produce(state, () => {
    switch (action.type) {
      case FETCHED_TICKET_REVENUE:
        return action.payload;
      default:
        return state;
    }
  });

const ticketRevenueByGroup = (state = [], action) =>
  produce(state, () => {
    switch (action.type) {
      case FETCHED_TICKET_REVENUE_BY_TICKET_GROUP:
        return action.payload;
      default:
        return state;
    }
  });

export default combineReducers({
  ticketRevenue,
  ticketRevenueByGroup,
});
