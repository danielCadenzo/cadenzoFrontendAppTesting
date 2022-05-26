import {
  FETCH_USER_DETAILS,
  SET_ACTIVE_PROFILE,
  FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_CREDENTIALS,
} from 'data/constants';
import {
  FOLLOW_ORGANIZER,
  UNFOLLOW_ORGANIZER,
  ARTIST_PROFILE_CREATE,
} from 'redux/ActionTypes';
import * as UserClient from 'data/clients/UserClient';
import * as AuthClient from 'data/clients/AuthClient';
import * as RequestStatus from 'redux/RequestStates';
import posthog from 'posthog-js';

export const fetchViewer = () => dispatch =>
  AuthClient.fetchViewerInfo()
    .then(response => {
      if (
        response.viewer &&
        response.viewer.email &&
        !window.location.href.includes('127.0.0.1')
      ) {
        posthog.identify(response.viewer.id);
        posthog.people.set({ email: response.viewer.email });
      }
      dispatch({
        type: FETCH_USER_DETAILS_SUCCESS,
        meta: { status: RequestStatus.SUCCEEDED },
        payload: {
          ...response.viewer,
        },
      });
      return response;
    })
    .catch(error => {
      dispatch({
        type: FETCH_USER_CREDENTIALS,
        meta: { status: RequestStatus.FAILED, error },
        payload: {},
      });
    });

export const fetchUserInfo = () => ({
  type: FETCH_USER_DETAILS,
});

export const followOrganizer = organizerIds => dispatch => {
  const payload = { organizerIds };
  return UserClient.followOrganizer([organizerIds]).then(response => {
    dispatch({
      type: FOLLOW_ORGANIZER,
      payload,
    });
    return response;
  });
};

export const unfollowOrganizer = organizerIds => dispatch => {
  const payload = { organizerIds };
  return UserClient.unfollowOrganizer([organizerIds]).then(response => {
    dispatch({
      type: UNFOLLOW_ORGANIZER,
      payload,
    });
    return response;
  });
};

export const createArtistProfile = form => dispatch =>
  UserClient.createArtistProfile(form).then(response => {
    dispatch({
      type: ARTIST_PROFILE_CREATE,
      payload: response.data,
      meta: RequestStatus.SUCCEEDED,
    });
    return response;
  });

// set's the active profile to one of the user profiles
export const setActiveProfile = profileId => dispatch =>
  dispatch({
    type: SET_ACTIVE_PROFILE,
    profileId,
    meta: RequestStatus.SUCCEEDED,
  });
