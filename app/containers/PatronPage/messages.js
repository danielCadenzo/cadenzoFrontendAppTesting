/*
 * PatronPage Messages
 *
 * This contains all the text for the PatronPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.PatronPage';

export default defineMessages({
  editMembership: {
    id: `${scope}.editMembership`,
    defaultMessage: 'Edit Membership',
  },
  addMembership: {
    id: `${scope}.addMembership`,
    defaultMessage: 'Add Membership',
  },
  name: {
    id: `${scope}.name`,
    defaultMessage: 'Membership Name',
  },
  price: {
    id: `${scope}.price`,
    defaultMessage: 'Price',
  },
  membershipType: {
    id: `${scope}.membershipType`,
    defaultMessage: 'Membership Type',
  },
  startDate: {
    id: `${scope}.startDate`,
    defaultMessage: 'Start Date',
  },
  endDate: {
    id: `${scope}.endDate`,
    defaultMessage: 'End Date',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
});
