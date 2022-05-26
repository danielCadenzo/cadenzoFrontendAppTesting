/*
 * EventPage Messages
 *
 * This contains all the text for the EventPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.EventPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the EventPage container!',
  },
  checkoutConfirmation: {
    id: `${scope}.checkoutConfirmation`,
    defaultMessage:
      "We've got your tickets confirmed for {eventTitle}, you should be receiving an email shortly!",
  },
  inTransfer: {
    id: `${scope}.inTransfer`,
    defaultMessage: 'In-transfer',
  },
  removeTicket: {
    id: `${scope}.removeTicket`,
    defaultMessage: 'Remove',
  },
  buyTicket: {
    id: `${scope}.buyTicket`,
    defaultMessage: 'Buy',
  },
});
