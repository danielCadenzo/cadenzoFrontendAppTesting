/*
 * ChatPageJs Messages
 *
 * This contains all the text for the ChatPageJs container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ChatPageJs';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ChatPageJs container!',
  },
  view: {
    id: `${scope}.view`,
    defaultMessage: 'View',
  },
  BOOKING: {
    id: `${scope}.BOOKING`,
    defaultMessage: 'Confirmed Booking',
  },
  BOOKING_REQUESTED: {
    id: `${scope}.BOOKING_REQUESTED`,
    defaultMessage: 'Booking Request',
  },
  BOOKING_ACCEPTED: {
    id: `${scope}.BOOKING_ACCEPTED`,
    defaultMessage: 'Booking Request Accepted',
  },
  BOOKING_MODIFIED: {
    id: `${scope}.BOOKING_MODIFIED`,
    defaultMessage: 'Booking Request Modified',
  },
  BOOKING_DECLINED: {
    id: `${scope}.BOOKING_DECLINED`,
    defaultMessage: 'Booking Request Declined',
  },
  hedader: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ChatPageJs container!',
  },
});
