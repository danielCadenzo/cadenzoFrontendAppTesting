import { push } from 'connected-react-router';
import {
  FETCH_USER_DETAILS_SUCCESS,
  CREATE_NOTIFICATION,
  ARCHIVE_NOTIFICATION,
} from 'data/constants';
import {
  NON_AUTH_ROUTES,
  NON_AUTH_REGEX_PATHS,
} from 'containers/App/constants';

export function authMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      // Do anything here: pass the action onwards with next(action),
      // or restart the pipeline with storeAPI.dispatch(action)
      // Can also use storeAPI.getState() here
      const {
        location: { pathname },
      } = window;
      if (action.type === FETCH_USER_DETAILS_SUCCESS) {
        if (
          !action.payload.email &&
          (pathname === '/' ||
            (!NON_AUTH_ROUTES.has(pathname) &&
              !NON_AUTH_REGEX_PATHS.some(regex => regex.test(pathname))))
        ) {
          storeAPI.dispatch(push('/login'));
        }
      }
      return next(action);
    };
  };
}

export function notificationMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      if (action.type === CREATE_NOTIFICATION) {
        const { timer, id } = action.payload;
        setTimeout(() => {
          storeAPI.dispatch({
            type: ARCHIVE_NOTIFICATION,
            payload: id,
          });
        }, timer);
      }
      return next(action);
    };
  };
}
