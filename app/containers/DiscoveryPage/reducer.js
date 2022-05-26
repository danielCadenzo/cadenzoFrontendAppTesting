/*
 *
 * DiscoveryPage reducer
 *
 */
import produce from 'immer';
import * as RequestStates from 'redux/RequestStates';
import {
  UPDATE_BOUNDING_BOX,
  FETCH_QUERY_RESULTS,
  SET_SEARCH_FILTERS,
  SET_GLOBAL_MAP_INFO,
  SET_LISTING_TYPE,
  PRIMARY_SEARCH_TYPES,
} from './constants';

import { SET_ACTIVE_PROFILE } from 'data/constants';

const DEFAULT_LAT_DIFF = 0.55;
const DEFAULT_LNG_DIFF = 0.55;
const INITIAL_LAT = 36.15398;
const INITIAL_LNG = -95.992775;

export const initialState = {
  queryResults: {},
  listings: [],
  listingType: PRIMARY_SEARCH_TYPES.VENUE,
  boundingBox: {
    _sw: {
      lng: INITIAL_LNG - DEFAULT_LNG_DIFF,
      lat: INITIAL_LAT - DEFAULT_LAT_DIFF,
    },
    _ne: {
      lng: INITIAL_LNG + DEFAULT_LNG_DIFF,
      lat: INITIAL_LAT + DEFAULT_LAT_DIFF,
    },
  },
  mapViewport: {},
  resultsRequestStatus: RequestStates.UNINITIALIZED,
  searchFilters: {
    isVerified: true,
    genres: [],
    performanceTypes: [],
    preferredPerformances: [],
    amenities: [],
    availabilityBetween: [null, null],
    mapRadius: 50,
  },
};

/* eslint-disable default-case, no-param-reassign */
const discoveryPageReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case SET_LISTING_TYPE: {
        return {
          ...state,
          listingType: action.payload,
        };
      }
      case FETCH_QUERY_RESULTS:
        return {
          ...state,
          queryResults: action.payload,
        };
      case UPDATE_BOUNDING_BOX:
        return {
          ...state,
          boundingBox: action.payload,
        };
      case SET_GLOBAL_MAP_INFO: {
        return {
          ...state,
          boundingBox: action.payload.boundingBox,
          mapViewport: action.payload.mapViewport,
        };
      }
      case SET_SEARCH_FILTERS: {
        return {
          ...state,
          searchFilters: {
            ...state.searchFilters,
            ...action.payload,
          },
        };
      }
      case SET_ACTIVE_PROFILE: {
        return {
          ...state,
          listings: [],
          queryResults: {},
        };
      }
    }
  });

export default discoveryPageReducer;
