/*
 *
 * ChatPageJs actions
 *
 */

import { FETCH_CHANNELS } from './constants';

export const unfavoriteEvent = eventId => dispatch => {
  const payload = { eventId };
  return EventClient.unfavoriteEvent([eventId]).then(response => {
    dispatch({
      type: FETCH_CHANNELS,
      payload,
    });
    return response;
  });
};
