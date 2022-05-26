import { createUUID } from 'utils/helpers';
import { DateTime } from 'luxon';
import { OVERRIDE_CALENDAR_FIELD, EnumLookup } from '../constants';

export const FORM_DEFAULT = {
  'SUNDAY-isEnabled': false,
  'MONDAY-isEnabled': true,
  'TUESDAY-isEnabled': true,
  'WEDNESDAY-isEnabled': true,
  'THURSDAY-isEnabled': true,
  'FRIDAY-isEnabled': true,
  'SATURDAY-isEnabled': true,
  SUNDAY: [],
  MONDAY: [],
  TUESDAY: [],
  WEDNESDAY: [],
  THURSDAY: [],
  FRIDAY: [],
  SATURDAY: [],
  [`${OVERRIDE_CALENDAR_FIELD}-isEnabled`]: true,
  [OVERRIDE_CALENDAR_FIELD]: [],
};

const ENABLEMENT_TOGGLES = {
  'SUNDAY-isEnabled': false,
  'MONDAY-isEnabled': true,
  'TUESDAY-isEnabled': true,
  'WEDNESDAY-isEnabled': true,
  'THURSDAY-isEnabled': true,
  'FRIDAY-isEnabled': true,
  'SATURDAY-isEnabled': true,
};

export const getDateTimeFromOverride = override => ({
  ...override,
  startTime: DateTime.fromSQL(
    `${override.day} ${override.startTime}`,
  ).toLocal(),
  endTime: DateTime.fromSQL(`${override.day} ${override.endTime}`).toLocal(),
});

export function mapCalendarToAvailabilityDefaults(
  calendar,
  profileDefaultLocation,
) {
  if (!calendar || !calendar.weeklyAvailability) return FORM_DEFAULT;
  const defaults = FORM_DEFAULT;
  const nodes = calendar.weeklyAvailability;
  nodes.forEach(availability => {
    defaults[EnumLookup[availability.dayOfWeek]].push({
      location: profileDefaultLocation,
      ...availability,
      startTime: DateTime.fromISO(availability.startTime, {
        zone: 'utc',
      }).toLocal(),
      endTime: DateTime.fromISO(availability.endTime, {
        zone: 'utc',
      }).toLocal(),
    });
  });

  Object.keys(ENABLEMENT_TOGGLES).forEach(dayofTheWeek => {
    const toggleKey = dayofTheWeek;
    const isEnabled =
      defaults[dayofTheWeek.replace('-isEnabled', '')].length > 0;
    defaults[toggleKey] = isEnabled;
  });

  calendar.scheduleOverrides.forEach(override => {
    defaults[OVERRIDE_CALENDAR_FIELD].push(getDateTimeFromOverride(override));
  });

  return defaults;
}

export const generateTimeRange = () => ({
  startDate: DateTime.local(2021, 1, 1, 8),
  endDate: DateTime.local(2021, 1, 1, 17),
  id: createUUID(),
});
