import moment from 'moment';

export function isBeforeDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;

  const aYear = a.year();
  const aMonth = a.month();

  const bYear = b.year();
  const bMonth = b.month();

  const isSameYear = aYear === bYear;
  const isSameMonth = aMonth === bMonth;

  if (isSameYear && isSameMonth) return a.date() < b.date();
  if (isSameYear) return aMonth < bMonth;
  return aYear < bYear;
}

export function isInclusivelyAfterDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b);
}

/**
 * Checks to see if the which confirmed slots match up with the availability by
 * returning a list of availability.
 */
export function getSlotsToDisplay(bookingCalendarDay) {
  const test = {
    amtSlotsFilled: 0,
    amtSlotsOpen: 1,
    availableSlots: [
      {
        endTime: '23:00:00',
        startTime: '12:00:00',
      },
    ],
    isAvailable: true,
    calendarDate: '2021-12-10',
    confirmedSlots: [
      {
        performer: {
          name: 'Romeo',
        },
        guarantee: 400,
      },
    ],
    requestedSlots: [],
  };
}
