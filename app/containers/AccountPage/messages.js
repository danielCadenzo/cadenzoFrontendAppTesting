/*
 * AccountPage Messages
 *
 * This contains all the text for the AccountPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.AccountPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AccountPage container!',
  },
  onMarketplace: {
    id: `${scope}.onMarketplace`,
    defaultMessage: 'On Marketplace',
  },

  inTransfer: {
    id: `${scope}.inTransfer`,
    defaultMessage: 'In-Transfer',
  },
  SUNDAY: {
    id: `${scope}.SUNDAY`,
    defaultMessage: 'Sun',
  },
  MONDAY: {
    id: `${scope}.MONDAY`,
    defaultMessage: 'Mon',
  },
  TUESDAY: {
    id: `${scope}.TUESDAY`,
    defaultMessage: 'Tues',
  },
  WEDNESDAY: {
    id: `${scope}.WEDNESDAY`,
    defaultMessage: 'Wed',
  },
  THURSDAY: {
    id: `${scope}.THURSDAY`,
    defaultMessage: 'Thurs',
  },
  FRIDAY: {
    id: `${scope}.FRIDAY`,
    defaultMessage: 'Fri',
  },
  SATURDAY: {
    id: `${scope}.SATURDAY`,
    defaultMessage: 'Sat',
  },
  unavailable: {
    id: `${scope}.unavailable`,
    defaultMessage: 'Unavailable',
  },
  dateOverrideHeader: {
    id: `${scope}.dateOverrideHeader`,
    defaultMessage: 'Add date overrides',
  },
  dateOverrideText: {
    id: `${scope}.dateOverrideText`,
    defaultMessage:
      'Add dates when your availability changes from your weekly hours',
  },
  scheduleSaved: {
    id: `${scope}.scheduleSaved.header`,
    defaultMessage: 'Schedule saved',
  },
  scheduleSavedMsg: {
    id: `${scope}.scheduleSaved.message`,
    defaultMessage: 'It can now be viewed by everyone',
  },
  scheduleNotSaved: {
    id: `${scope}.scheduleNotSaved.header`,
    defaultMessage: 'Schedule could not be saved',
  },
  scheduleNotSavedMsg: {
    id: `${scope}.scheduleNotSaved.message`,
    defaultMessage: 'If the issue persists, reach out to us!',
  },
});
