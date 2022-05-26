/*
 *
 * CreateArtistPage actions
 *
 */

import * as RequestStates from 'redux/RequestStates';
import cadenzoApi from 'data/clients/utils';
import {
  CREATE_HOST_PROFILE,
  CREATE_HOST_PROFILE_WITH_EXACT_CAPACITY,
  EDIT_HOST_PROFILE_WITH_EXACT_CAPACITY,
  EDIT_HOST_PROFILE,
} from 'data/queries/mutations/User';
import { CREATE_VENUE, EDIT_VENUE } from './constants';

export const createVenueProfile = values => dispatch => {
  const useExactCapacity = values.exactCapacity && values.exactCapacity > 0;
  const query = useExactCapacity
    ? CREATE_HOST_PROFILE_WITH_EXACT_CAPACITY
    : CREATE_HOST_PROFILE;
  return cadenzoApi.post(query, values).then(response => {
    dispatch({
      type: CREATE_VENUE,
      payload: response,
      meta: { status: RequestStates.SUCCEEDED },
    });
    return response;
  });
};

export const editVenueProfile = values => dispatch => {
  const useExactCapacity = values.exactCapacity && values.exactCapacity > 0;
  const query = useExactCapacity
    ? EDIT_HOST_PROFILE
    : EDIT_HOST_PROFILE_WITH_EXACT_CAPACITY;
  return cadenzoApi.post(query, values).then(response => {
    dispatch({
      type: EDIT_VENUE,
      payload: response,
      meta: { status: RequestStates.SUCCEEDED },
    });
    return response;
  });
};
