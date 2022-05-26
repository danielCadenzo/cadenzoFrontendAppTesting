import { takeEvery, put } from 'redux-saga/effects';
import { signupUser, loginUser, BASE_URL } from 'data/api';
import { FETCH_USER_CREDENTIALS_SUCESS } from 'data/constants';
import { setCookie, eraseCookie } from 'utils/localStorage';
import {
  LOGIN_USER_PENDING,
  LOGIN_USER_ERROR,
  SIGNUP_PENDING,
  SIGNOUT_USER,
} from './constants';

// Actions
export const loginUserAction = (email, password) => ({
  type: LOGIN_USER_PENDING,
  email,
  password,
});

export const signupUserAction = (email, password, phoneNumber) => ({
  type: SIGNUP_PENDING,
  email,
  password,
  phoneNumber,
});

export const signoutUserAction = () => ({
  type: SIGNOUT_USER,
});

// Sagas
function* loginSaga(action) {
  try {
    const response = yield loginUser(action.email, action.password);
    if (response.token) {
      yield put({ type: FETCH_USER_CREDENTIALS_SUCESS, ...response });
      setCookie('authtoken', response.token, 30);
      window.location.href = '/';
    }
    if (!response.token) {
      yield put({
        type: LOGIN_USER_ERROR,
      });
    }
  } catch {}
}

function* signoutSaga() {
  setCookie('authtoken', null, -30);
  setCookie('activeProfileId', null, -30);
  eraseCookie('authtoken');
  eraseCookie('activeProfileId');
  window.location = `${BASE_URL}/login`;
}

function* signupUserSaga(action) {
  try {
    const response = yield signupUser(
      action.email,
      action.password,
      action.phoneNumber,
    );
    if (response.token) {
      setCookie('authtoken', response.token, 30);
      window.location.href = '/profile/onboarding';
    }
  } catch {}
}

function* authSaga(action) {
  setCookie('authtoken', action.token, 30);
}

export default function* rootSaga() {
  yield takeEvery(LOGIN_USER_PENDING, loginSaga);
  yield takeEvery(SIGNUP_PENDING, signupUserSaga);
  yield takeEvery(FETCH_USER_CREDENTIALS_SUCESS, authSaga);
  yield takeEvery(SIGNOUT_USER, signoutSaga);
}
