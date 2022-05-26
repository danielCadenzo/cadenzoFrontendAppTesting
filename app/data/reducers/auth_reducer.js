/*
 *
 * Authentication reducer
 *
 */
import produce from 'immer';
import { getCookie, eraseCookie, setCookie } from 'utils/localStorage';
import { SIGNOUT_USER, LOGIN_USER_ERROR } from 'containers/LoginPage/constants';
import * as RequestStates from 'redux/RequestStates';
import {
  FETCH_USER_CREDENTIALS_SUCESS,
  FETCH_USER_DETAILS_SUCCESS,
  UPDATE_PROFILE_INFO,
  FETCH_USER_CREDENTIALS,
  SET_ACTIVE_PROFILE,
} from '../constants';

const ACTIVE_PROFILE_COOKIE = 'activeProfileId';

export const initialState = {
  email: '',
  avatar: '',
  id: '',
  venues: [],
  attachedArtists: [],
  phoneNumber: '',
  name: '',
  is2faEnabled: false,
  isOrganizer: false,
  loginError: false,
  token: getCookie('authtoken') || '',
  loggedIn:
    getCookie('authtoken') !== '' &&
    getCookie('authtoken') !== 'undefined' &&
    !!getCookie('authtoken'),
  // the venue or artist profile that the base user is using
  activeProfileId: getCookie(ACTIVE_PROFILE_COOKIE) || null,
  requestStatus: RequestStates.UNINITIALIZED,
};

/* eslint-disable default-case, no-param-reassign */
const authReducer = (state = initialState, action) =>
  produce(state, () => {
    switch (action.type) {
      case FETCH_USER_CREDENTIALS_SUCESS: {
        const { token, email, avatar, isOrganizer, meta = {} } = action;
        return {
          ...state,
          token,
          email,
          avatar,
          isOrganizer,
          loggedIn: true,
          requestStatus: meta.status,
          loginError: false,
        };
      }
      case LOGIN_USER_ERROR: {
        return {
          loginError: true,
        };
      }
      case FETCH_USER_CREDENTIALS: {
        const { meta } = action;
        return {
          ...state,
          requestStatus: meta.status,
        };
      }
      case FETCH_USER_DETAILS_SUCCESS: {
        const { payload, meta } = action;
        const { attachedArtists } = payload;

        const artistProfiles = attachedArtists || [];

        return {
          ...state,
          ...payload,
          attachedArtists: artistProfiles,
          requestStatus: meta.status,
        };
      }
      case UPDATE_PROFILE_INFO: {
        const { payload } = action;
        return { ...state, ...payload };
      }
      case SIGNOUT_USER: {
        return { ...state, loggedIn: false, token: null };
      }
      case SET_ACTIVE_PROFILE: {
        const { profileId } = action;
        if (!profileId) eraseCookie(ACTIVE_PROFILE_COOKIE);
        if (profileId) setCookie(ACTIVE_PROFILE_COOKIE, profileId, 7);
        return { ...state, activeProfileId: profileId };
      }
      default:
        return state;
    }
  });

export default authReducer;
