/*
 *
 * DiscoveryPage constants
 *
 */
import AmenityTypes from 'constants/AmenityTypes';
import SpaceTypes from 'constants/SpaceTypes';
import GenreTypes from 'constants/GenreTypes';
import VenueCapacities from 'constants/VenueCapacities';

export const DEFAULT_ACTION = 'app/DiscoveryPage/DEFAULT_ACTION';
export const FETCH_QUERY_RESULTS = 'app/DiscoveryPage/FETCH_QUERY_RESULTS';
export const SET_LISTINGS = 'app/DiscoveryPage/SET_LISTINGS';
export const UPDATE_BOUNDING_BOX = 'app/DiscoveryPage/UPDATE_BOUNDING_BOX';
export const SET_GLOBAL_MAP_INFO = 'app/DiscoveryPage/SET_GLOBAL_MAP_INFO';
export const SET_SEARCH_FILTERS = 'SET_SEARCH_FILTERS';
export const SET_LISTING_TYPE = 'app/DiscoveryPage/SET_LISTING_TYPE';

export const DEFAULT_LAT_DIFF = 0.115788387;
export const DEFAULT_LNG_DIFF = 0.1222229;

export const PRIMARY_SEARCH_TYPES = Object.freeze({
  ARTIST: 'ARTIST',
  VENUE: 'VENUE',
});

export const SPACE_OPTIONS = Object.keys(SpaceTypes).map(optionKey => ({
  label: SpaceTypes[optionKey],
  value: optionKey,
}));

export const GENRE_OPTIONS = Object.keys(GenreTypes).map(optionKey => ({
  label: GenreTypes[optionKey],
  value: optionKey,
}));

export const CAPACITY_OPTIONS = Object.keys(VenueCapacities).map(optionKey => ({
  label: VenueCapacities[optionKey],
  value: optionKey,
}));

export const AMENITY_OPTIONS = Object.keys(AmenityTypes).map(optionKey => ({
  label: AmenityTypes[optionKey],
  value: optionKey,
}));

export const MAP_STYLES = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];
