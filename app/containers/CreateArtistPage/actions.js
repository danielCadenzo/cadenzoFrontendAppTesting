/*
 *
 * CreateArtistPage actions
 *
 */

import * as RequestStates from 'redux/RequestStates';
import cadenzoApi from 'data/clients/utils';
import {
  EDIT_ARTIST_PROFILE_MUTATION,
  CREATE_ARTIST_PROFILE,
} from 'data/queries/mutations/User';
import {
  CREATE_ARTIST_PROFILE_ACTION,
  EDIT_ARTIST_PROFILE_ACTION,
} from './constants';

export const createArtistProfile = values => dispatch =>
  cadenzoApi.post(CREATE_ARTIST_PROFILE, values).then(response => {
    dispatch({
      type: CREATE_ARTIST_PROFILE_ACTION,
      payload: response,
      meta: { status: RequestStates.SUCCEEDED },
    });
    return response;
  });

export const editArtistProfile = values => dispatch =>
  cadenzoApi.post(EDIT_ARTIST_PROFILE_MUTATION, values).then(response => {
    dispatch({
      type: EDIT_ARTIST_PROFILE_ACTION,
      payload: response,
      meta: { status: RequestStates.SUCCEEDED },
    });
    return response;
  });
