import styled from 'styled-components';

export const AmenityTypes = Object.freeze({
  PA_SYSTEM_AVAILABLE: 'PA_SYSTEM_AVAILABLE',
  IN_HOUSE_BACKLINE: 'IN_HOUSE_BACKLINE',
  ALL_AGES_SHOWS: 'ALL_AGES_SHOWS',
  DRINKING_AGE_ONLY: 'DRINKING_AGE_ONLY',
  HAS_PREP_ROOM: 'HAS_PREP_ROOM',
  BILL_AVAILABLE: 'BILL_AVAILABLE',
  MUSIC_ON_PATIO_OR_OUTSIDE: 'MUSIC_ON_PATIO_OR_OUTSIDE',
  MUSIC_INSIDE: 'MUSIC_INSIDE',
  FOOD_AVAILABLE: 'FOOD_AVAILABLE',
  ACCESSIBLE: 'ACCESSIBLE',
  PARKING_AVAILABLE: 'PARKING_AVAILABLE',
  PETS_LIVESTOCK: 'PETS_LIVESTOCK',
});

export const CapacityAmounts = Object.freeze({
  INTIMATE: 'Initimate (up to 20 guests)',
  SMALL: 'Small (up to 60 guests)',
  MEDIUM: 'Medium (up to 120 guests)',
  LARGE: 'Large (up to 300 guests)',
  VERY_LARGE: 'Very Large (300+ guests)',
});

export const Genres = Object.freeze({
  Acoustic: 'Acoustic',
  BLUEGRASS: 'Bluegrass',
  BLUES: 'Blues',
  CHILDREN_FAMILY: 'Children/Family',
  CLASSICAL: 'Classical',
  COUNTRY: 'Country',
  COVER_ARTIST: 'Cover artist',
  ELECTRONIC: 'Electronic',
  FOLK: 'Folk',
  HIP_HOP: 'Hip Hop',
  INDIE_ALTERNATIVE: 'Indie/Alternative',
  METAL: 'Metal',
  JAZZ: 'Jazz',
  POP: 'Pop',
  PUNK: 'Punk',
  R_B: 'R&B',
  ROCK: 'Rock',
  SOUL: 'Soul',
  OTHER: 'Other',
});

export const SpaceTypes = Object.freeze({
  BAR: 'Bar',
  RESTAURANT: 'Restaurant',
  LIVE_MUSIC_VENUE: 'Live Music Venue',
  EVENT_SPACE: 'Event Space',
  OUTDOOR_AMPHITHEATER: 'Outdoors Area/Amphitheater',
});

export const PAGE_STEPS = Object.freeze({
  BASIC_INFO: 'BASIC_INFO',
  DETAILED_INFO: 'DETAILED_INFO',
  MEDIA_INFO: 'MEDIA_INFO',
});

export const Header = styled.div`
  background-color: black;
  background: linear-gradient(93.34deg, #5926cc 0%, #a84bf5 100%);
  width: 100%;
  /* height: 200px; */
  margin-bottom: -60px;
  /* box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.4); */
  background-size: auto;
  background-position: center;
  color: white !important;
  padding: 80px 20px 120px 20px !important;
`;

export const Headline = styled.h2`
  font-style: normal;
  font-weight: bold;
  font-size: 72px;
  line-height: 84px;
  letter-spacing: -0.02em;
  color: #ffffff;
  max-width: 400px;
`;

export const FormContainer = styled.div`
  background-color: white;
  color: black;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
`;

export const TextContainer = styled.p`
  max-width: min(500px, 100%);
`;

export const CREATE_VENUE = 'app/CreateHostPage/CREATE_VENUE';
export const EDIT_VENUE = 'app/CreateHostPage/EDIT_VENUE';
