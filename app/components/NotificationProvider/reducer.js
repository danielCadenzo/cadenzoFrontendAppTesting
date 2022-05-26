import produce from 'immer';
import { ARCHIVE_NOTIFICATION, CREATE_NOTIFICATION } from 'data/constants';

export const initialState = {
  notifications: {},
};

/* eslint-disable default-case, no-param-reassign */
/**
 * Expects notifications in the form of {
 *  timer: the notification timeout
 *  message: The text for the notification
 *  header: The notification header in bold
 *  type: (optional, default to "info") The type of notification ("warning", "error", "info")
 *  id: Auto-generated in the action
 * }
 */
const notificationProviderReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case CREATE_NOTIFICATION:
        return {
          ...state,
          notifications: {
            ...state.notifications,
            [action.payload.id]: action.payload,
          },
        };
      case ARCHIVE_NOTIFICATION: {
        const { payload } = action;
        if (!payload) return state;
        delete state.notifications[payload];
        return {
          notifications: {
            ...state.notifications,
          },
        };
      }
    }
  });

export default notificationProviderReducer;
