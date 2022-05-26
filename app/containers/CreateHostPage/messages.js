/*
 * CreateHostPage Messages
 *
 * This contains all the text for the CreateHostPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CreateHostPage';

export default defineMessages({
  headerEdit: {
    id: `${scope}.headerEdit`,
    defaultMessage: 'Edit Venue Profile',
  },
  headerCreate: {
    id: `${scope}.headerCreate`,
    defaultMessage: 'Create Venue Profile',
  },
  address: {
    id: `${scope}.address`,
    defaultMessage: 'Address',
  },
  next: {
    id: `${scope}.next`,
    defaultMessage: 'Next',
  },
  previous: {
    id: `${scope}.previous`,
    defaultMessage: 'Previous',
  },
  uploadAvatar: {
    id: `${scope}.uploadAvatar`,
    defaultMessage: 'Profile Picture',
  },
  submitTextEdit: {
    id: `${scope}.submitText.edit`,
    defaultMessage: 'Save Changes',
  },
  submitTextCreate: {
    id: `${scope}.submitText.create`,
    defaultMessage: 'Create Space',
  },
  PA_SYSTEM_AVAILABLE: {
    id: `${scope}.PA_SYSTEM_AVAILABLE`,
    defaultMessage: 'PA system available',
  },
  PARKING_AVAILABLE: {
    id: `${scope}.PARKING_AVAILABLE`,
    defaultMessage: 'Complimentary parking available',
  },
  BILL_AVAILABLE: {
    id: `${scope}.BILL_AVAILABLE`,
    defaultMessage: 'Perfromers can be tipped',
  },
  ACCESSIBLE: {
    id: `${scope}.ACCESSIBLE`,
    defaultMessage: 'Handicap accessible',
  },
  PETS_LIVESTOCK: {
    id: `${scope}.PETS_LIVESTOCK`,
    defaultMessage: 'Space is pet-friendly',
  },
  HAS_PREP_ROOM: {
    id: `${scope}.HAS_PREP_ROOM`,
    defaultMessage: 'Artist prep room available',
  },
  IN_HOUSE_BACKLINE: {
    id: `${scope}.IN_HOUSE_BACKLINE`,
    defaultMessage: 'In-House backline',
  },
  DRINKING_AGE_ONLY: {
    id: `${scope}.DRINKING_AGE_ONLY`,
    defaultMessage: '21+ only',
  },
  ALL_AGES_SHOWS: {
    id: `${scope}.ALL_AGES_SHOWS`,
    defaultMessage: 'All ages shows',
  },
  MUSIC_ON_PATIO_OR_OUTSIDE: {
    id: `${scope}.MUSIC_ON_PATIO_OR_OUTSIDE`,
    defaultMessage: 'Music on patio/outside',
  },
  MUSIC_INSIDE: {
    id: `${scope}.MUSIC_INSIDE`,
    defaultMessage: 'Music inside',
  },
  FOOD_AVAILABLE: {
    id: `${scope}.FOOD_AVAILABLE`,
    defaultMessage: 'Food available for purchase',
  },
  SHOWS_OPEN_TO_PUBLIC: {
    id: `${scope}.SHOWS_OPEN_TO_PUBLIC`,
    defaultMessage: 'Public Shows',
  },
  DJ_TURNTABLES: {
    id: `${scope}.DJ_TURNTABLES`,
    defaultMessage: 'DJ Turntable Available',
  },
});
