/*
 *
 * AccountPage constants
 *
 */

export const DEFAULT_ACTION = 'app/AccountPage/DEFAULT_ACTION';

export const TICKET_TIME_PERIOD = Object.freeze({
  UPCOMING: 'UPCOMING',
  PAST: 'PAST',
});

export const TICKET_TRANSFER_STATUS = Object.freeze({
  IN_PROGRESS: 'IN_PROGRESS',
  ACCEPTED: 'ACCEPTED',
  DENIED: 'DENIED',
  CANCELLED: 'CANCELLED',
});

export const DAYS_OF_WEEK = Object.freeze([
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]);

export const DayEnum = Object.freeze({
  SUNDAY: 'Sun',
  MONDAY: 'Mon',
  TUESDAY: 'Tues',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thurs',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
});

export const EnumLookup = Object.freeze({
  SUN: 'SUNDAY',
  MON: 'MONDAY',
  TUES: 'TUESDAY',
  WED: 'WEDNESDAY',
  THURS: 'THURSDAY',
  FRI: 'FRIDAY',
  SAT: 'SATURDAY',
});

// The name of the field that's used to store temporary values
export const OVERRIDE_CALENDAR_FIELD = 'OVERRIDE_CALENDAR_FIELD';
