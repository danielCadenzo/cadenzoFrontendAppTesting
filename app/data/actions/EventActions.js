import {
  FOLLOW_EVENT,
  UNFOLLOW_EVENT,
  FETCH_MARKETPLACE_TICKETS,
} from 'redux/ActionTypes';
import * as EventClient from 'data/clients/eventClient';
import * as RequestStates from 'redux/RequestStates';
import { flattenGQLEdges } from 'utils/helpers';

export const favoriteEvent = eventId => dispatch => {
  const payload = { eventId };
  return EventClient.favoriteEvent([eventId]).then(response => {
    dispatch({
      type: FOLLOW_EVENT,
      payload,
    });
    return response;
  });
};

export const unfavoriteEvent = eventId => dispatch => {
  const payload = { eventId };
  return EventClient.unfavoriteEvent([eventId]).then(response => {
    dispatch({
      type: UNFOLLOW_EVENT,
      payload,
    });
    return response;
  });
};

export const deleteEvent = id => () => EventClient.deleteEvent(id);

export const fetchMarketplaceTickets = eventId => dispatch =>
  EventClient.fetchMarketplaceTickets(eventId).then(response => {
    const { tickets } = response;
    dispatch({
      type: FETCH_MARKETPLACE_TICKETS,
      payload: flattenGQLEdges(tickets.edges),
      meta: { status: RequestStates.SUCCEEDED },
    });
    return response;
  });
