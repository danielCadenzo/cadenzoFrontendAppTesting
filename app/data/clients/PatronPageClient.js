import { EVENT_ATTENDEE_LIST } from 'data/queries/Event';
import { CHECK_IN_ALL_USER_TICKETS } from 'queries/User';
import cadenzoApi from './utils';

export const eventAttendeeList = variables =>
  cadenzoApi.post(EVENT_ATTENDEE_LIST, variables);

export const checkinUser = variables =>
  cadenzoApi.post(CHECK_IN_ALL_USER_TICKETS, variables);
