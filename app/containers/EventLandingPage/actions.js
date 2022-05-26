/*
 *
 * LandingPage actions
 *
 */

import { GET_VIEWABLE_EVENTS } from './constants';

export function fetchViewableEvents(events) {
  return {
    type: GET_VIEWABLE_EVENTS,
    events,
  };
}
