/*
 * VenueDesigner Messages
 *
 * This contains all the text for the VenueDesigner container.
 */

import { defineMessages } from 'react-intl';
import * as FieldTypes from './FieldTypes';

export const scope = 'app.containers.VenueDesigner';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the VenueDesigner container!',
  },
  section: {
    id: `${scope}.section`,
    defaultMessage: 'Section',
  },
  assignedSeating: {
    id: `${scope}.assignedSeating`,
    defaultMessage: 'Assigned Seating',
  },
  selectVenueMap: {
    id: `${scope}.selectVenueMap`,
    defaultMessage: 'Select Venue',
  },
  chooseVenue: {
    id: `${scope}.chooseVenue`,
    defaultMessage: 'Choose a venue to edit or create a new one',
  },
  selectVenuePlaceholder: {
    id: `${scope}.selectVenuePlaceholder`,
    defaultMessage: 'Select A Venue',
  },
  create: {
    id: `${scope}.create`,
    defaultMessage: 'Create',
  },
  load: {
    id: `${scope}.load`,
    defaultMessage: 'Load',
  },
  generalAdmission: {
    id: `${scope}.generalAdmission`,
    defaultMessage: 'General Admission',
  },
  label: {
    id: `${scope}.label`,
    defaultMessage: 'Label',
  },
  icon: {
    id: `${scope}.icon`,
    defaultMessage: 'Icon',
  },
  table: {
    id: `${scope}.table`,
    defaultMessage: 'Table',
  },
  [FieldTypes.SELECT_FIELD]: {
    id: `${scope}.${FieldTypes.SELECT_FIELD}`,
    defaultMessage: 'Table',
  },
});
