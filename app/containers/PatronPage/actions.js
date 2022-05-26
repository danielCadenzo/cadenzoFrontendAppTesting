/*
 *
 * PatronPage actions
 *
 */

import { FETCH_USER_LIST, FETCH_MEMBERSHIP_LIST } from './constants';

export function fetchUsersAction(users) {
  return {
    type: FETCH_USER_LIST,
    users,
  };
}

export function fetchMembershipsAction(memberships) {
  return {
    type: FETCH_MEMBERSHIP_LIST,
    memberships,
  };
}
