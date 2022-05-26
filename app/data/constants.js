/**
 * SUCESS EVENTS ARE TYPICALLY ONLY USED IN THE SAGAS THEMSELVES
 */

export const FETCH_USER_CREDENTIALS_SUCESS =
  'api/FETCH_USER_CREDENTIALS_SUCESS';
export const FETCH_USER_CREDENTIALS = 'api/FETCH_USER_CREDENTIALS';
export const FETCH_VIEWER_EVENTS_SUCCESS = 'api/FETCH_EVENTS_SUCCESS';
export const FETCH_VIEWER_EVENTS = 'api/FETCH_VIEWER_EVENTS';

export const FETCH_USER_DETAILS = 'api/FETCH_USER_DETAILS';
export const FETCH_USER_DETAILS_SUCCESS = 'api/FETCH_USER_DETAILS_SUCCESS';
export const UPDATE_PROFILE_INFO = 'api/UPDATE_PROFILE_INFO';
export const SET_ACTIVE_PROFILE = 'api/SET_ACTIVE_PROFILE';
export const CREATE_NOTIFICATION = 'notifications/CREATE_NOTIFICATION';
export const ARCHIVE_NOTIFICATION = 'notifications/ARCHIVE_NOTIFICATION';

export const FETCH_BOOKINGS = 'dashboard/FETCH_BOOKINGS';
export const UPDATE_BOOKING = 'dashboard/UPDATE_BOOKING';

export const requestBaseURL =
  window.location.origin === 'http://127.0.0.1:3000' ||
  window.location.origin === 'http://127.0.0.1:8000'
    ? process.env.API_PATH
    : window.location.origin;

export const UPLOAD_GENERIC_FILES = `
mutation($attachedFile: Upload!, $filename:String!){
  uploadGenericFile(attachedFile:$attachedFile, filename: $filename){
    success
    imageUrl
  }
}`;
