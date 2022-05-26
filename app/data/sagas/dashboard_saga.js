import { takeEvery, takeLatest, put, select } from 'redux-saga/effects';
import { createGQLQuery } from 'data/api';
import * as RequestStates from 'redux/RequestStates';

import {
  FETCH_VIEWER_EVENTS,
  FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_DETAILS,
  FETCH_VIEWER_EVENTS_SUCCESS,
} from 'data/constants';
import {
  GET_VIEWER_INFO,
  GET_VIEWER_ORGANIZER_EVENTS,
} from 'data/queries/dashboard';

let REATTEMPT_COUNTER = 0;

// Actions
export const fetchViewerEventsAction = () => ({
  type: FETCH_VIEWER_EVENTS,
});

export const fetchLoggedInUserAction = () => dispatch =>
  dispatch({
    type: FETCH_USER_DETAILS,
    meta: {
      status: RequestStates.PENDING,
    },
  });

// Sagas
function* fetchViewerInfoSaga() {
  try {
    const { viewer } = yield createGQLQuery(GET_VIEWER_INFO);
    yield put({
      type: FETCH_USER_DETAILS_SUCCESS,
      meta: { status: RequestStates.SUCCEEDED },
      payload: {
        ...viewer,
      },
    });
  } catch {
    if (REATTEMPT_COUNTER < 1) {
      REATTEMPT_COUNTER++;
      yield put({
        type: FETCH_USER_DETAILS,
        meta: {
          status: RequestStates.PENDING,
        },
      });
    }
  }
}

function* getOrganizerEventsSaga() {
  try {
    const state = yield select();
    const { email } = state.authReducer;
    const { events } = yield createGQLQuery(GET_VIEWER_ORGANIZER_EVENTS, {
      email,
    });
    const { edges } = events;
    yield put({ type: FETCH_VIEWER_EVENTS_SUCCESS, events: edges });
  } catch {
    // window.location = `${BASE_URL}/login`;
  }
}

export default function* rootSaga() {
  yield takeEvery(FETCH_VIEWER_EVENTS, getOrganizerEventsSaga);
  yield takeLatest(FETCH_USER_DETAILS, fetchViewerInfoSaga);
}
