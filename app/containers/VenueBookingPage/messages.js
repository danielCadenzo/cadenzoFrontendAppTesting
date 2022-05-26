/*
 * VenueBookingPage Messages
 *
 * This contains all the text for the VenueBookingPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.VenueBookingPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Venue Booking Page',
  },
  amenityHeader: {
    id: `${scope}.amenitiyHeader`,
    defaultMessage: 'What this place offers',
  },
  PA_SYSTEM: {
    id: `${scope}.PA_SYSTEM`,
    defaultMessage: 'PA system available',
  },
  PA_SYSTEM_AVAILABLE: {
    id: `${scope}.PA_SYSTEM`,
    defaultMessage: 'PA system available', 
  },
  SHOWS_OPEN_TO_PUBLIC: {
    id: `${scope}.SHOWS_OPEN_TO_PUBLIC`,
    defaultMessage: 'Public Shows',
  },
  DJ_TURNTABLES: {
    id: `${scope}.DJ_TURNTABLES`,
    defaultMessage: 'DJ Turntable Available',
  },
  PARKING_AVAILABLE: {
    id: `${scope}.PARKING_AVAILABLE`,
    defaultMessage: 'Parking available',
  },
  BILL_AVAILABLE: {
    id: `${scope}.BILL_AVAILABLE`,
    defaultMessage: 'Performer tips',
  },
  ACCESSIBLE: {
    id: `${scope}.ACCESSIBLE`,
    defaultMessage: 'Handicap accessible',
  },
  PETS_LIVESTOCK: {
    id: `${scope}.PETS_LIVESTOCK`,
    defaultMessage: 'Space is pet-friendly',
  },
  IN_HOUSE_BACKLINE: {
    id: `${scope}.HAS_PREP_ROOM`,
    defaultMessage: 'Prep room',
  },
  HAS_PREP_ROOM: {
    id: `${scope}.HAS_PREP_ROOM`,
    defaultMessage: 'Prep room',
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
  DRINKING_AGE_ONLY: {
    id: `${scope}.DRINKING_AGE_ONLY`,
    defaultMessage: 'Drinking age only',
  },
  ALL_AGES_SHOWS: {
    id: `${scope}.ALL_AGES_SHOWS`,
    defaultMessage: 'All ages allowed',
  },
});
