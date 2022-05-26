import { CREATE_NOTIFICATION } from 'data/constants';
import { createUUID } from 'utils/helpers';

export const createNotification = (message, header, timer) => dispatch =>
  dispatch({
    type: CREATE_NOTIFICATION,
    payload: {
      id: createUUID(),
      message,
      header,
      timer,
    },
  });
