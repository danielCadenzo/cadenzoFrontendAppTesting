/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.HomePage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the HomePage container!',
  },
  date: {
    id: `${scope}.date`,
    defaultMessage: 'Date',
  },
  name: {
    id: `${scope}.name`,
    defaultMessage: 'Name',
  },
  time: {
    id: `${scope}.time`,
    defaultMessage: 'Time',
  },
  numberOfDocuments: {
    id: `${scope}.numberOfDocuments`,
    defaultMessage: 'No. of documents',
  },
  downloadAll: {
    id: `${scope}.downloadAll`,
    defaultMessage: 'Download all',
  },
  view: {
    id: `${scope}.view`,
    defaultMessage: 'View',
  },
  bannerCalendarTitle: {
    id: `${scope}.bannerCalendarTitle`,
    defaultMessage: 'You need a calendar',
  },
  bannerCalendarText: {
    id: `${scope}.bannerCalendarText`,
    defaultMessage:
      'The best way to get the best bookings is to set up your calendar ',
  },
  adminModalHelp: {
    id: `${scope}.adminModalHelp`,
    defaultMessage:
      'Admins manage all aspects of a profile. From profile management, calendar editing, and booking, to payment methods.',
  },
  REQUESTS: {
    id: `${scope}.REQUESTS`,
    defaultMessage: 'Booking Requests',
  },
  UPCOMING_SHOWS: {
    id: `${scope}.UPCOMING_SHOWS`,
    defaultMessage: 'Upcoming Shows',
  },
  CANCELLED_SHOWS: {
    id: `${scope}.CANCELLED_SHOWS`,
    defaultMessage: 'Cancelled Shows',
  },
  DOCUMENTS: {
    id: `${scope}.DOCUMENTS`,
    defaultMessage: 'Documents',
  },
  viewDetails: {
    id: `${scope}.viewDetails`,
    defaultMessage: 'View Details',
  },
});
