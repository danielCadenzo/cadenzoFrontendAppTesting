/*
 *
 * PatronPage reducer
 *
 */
import produce from 'immer';
import {
  FETCH_USER_LIST,
  FETCH_MEMBERSHIP_LIST,
  ATTENDEE_STATUS,
} from 'containers/PatronPage/constants';

export const initialState = {
  userList: [],
  resellerList: [],
  membershipList: [],
  attendeeListCounts: {
    [ATTENDEE_STATUS.ATTENDING]: 0,
    [ATTENDEE_STATUS.CHECKED_IN]: 0,
    [ATTENDEE_STATUS.RESELLER]: 0,
  },
};

/* eslint-disable default-case, no-param-reassign */
const patronPageReducer = (state = initialState, action) =>
  produce(state, () => {
    switch (action.type) {
      case FETCH_USER_LIST: {
        const { users, attendeeListCounts } = action;

        attendeeListCounts.forEach(dataPoint => {
          state.attendeeListCounts[dataPoint.label] = dataPoint.value;
        });
        return { ...state, userList: users || [] };
      }
      case FETCH_MEMBERSHIP_LIST: {
        const { memberships } = action;
        return { ...state, membershipList: memberships };
      }
      default:
        return state;
    }
  });

export default patronPageReducer;
