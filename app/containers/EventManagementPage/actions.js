import { FETCH_SELECTED_EVENT } from './constants';

export function fetchSelectedEventAction(result) {
  return {
    type: FETCH_SELECTED_EVENT,
    result,
  };
}
