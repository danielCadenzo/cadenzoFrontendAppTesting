/* eslint-disable no-extend-native */
/* eslint-disable func-names */
import { DateTime } from 'luxon';

export const ISO_TIME_FORMAT = 'HH:mm';
export const ISO_MONTH_FORMAT = 'YYYY-MM';
export const ISO_FORMAT = 'YYYY-MM-DD';
export const LUXON_ISO_DATE_FORMAT = 'y-LL-dd';
export const LOCAL_TIME_FORMAT = 'HH:mm aa';

export function toMonthDayString(dateObj) {
  const options = { month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

export function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export const isBeforeToday = date => {
  const today = new Date();
  return (
    (date.getMonth() >= today.getMonth() &&
      date.getDate() >= today.getDate() &&
      date.getFullYear() >= today.getFullYear()) ||
    (date.getMonth() > today.getMonth() &&
      date.getFullYear() >= today.getFullYear()) ||
    date.getFullYear() > today.getFullYear()
  );
};

export function toFullDate12hr(dateObj) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Chicago', // TODO: Remove
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    hour12: true,
    timeZoneName: 'short',
  };
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

export function shortDate(dateObj) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

// Creates a localized date object
export function dateFromUTC(dateValue) {
  return DateTime.fromISO(dateValue).toJSDate();
}

// gets the days ago from a date from midnight
export function getXDaysAgo(date, daysAgo) {
  const time = date.getTime();
  const msSinceMidnight = time - date.setHours(0, 0, 0, 0);
  const daysAgoInMs = daysAgo * 100 * 60 * 60 * 24 + msSinceMidnight;
  return new Date(time - daysAgoInMs);
}

export function dateStrFromIsoString(isoString) {
  return isoString.split('T')[0];
}

export const DAY_MONTH_TIME_FORMAT = 'ccc, LLLL dd t';

export function fromServerTime(serverTime) {
  return DateTime.fromISO(serverTime, { zone: 'utc' }).toLocal();
}

export function toServerTime(luxonDateTime) {
  return luxonDateTime.toUTC();
}

export function toGQLDate(luxonDateTime) {
  return luxonDateTime.toLocaleString('yyyy - mm - dd');
}

export function momentToLuxon(momentObj) {
  return DateTime.fromJSDate(momentObj.toDate());
}
