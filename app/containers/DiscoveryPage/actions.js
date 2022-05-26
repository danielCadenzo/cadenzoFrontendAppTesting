/*
 *
 * DiscoveryPage actions
 *
 */

import {
  DEFAULT_ACTION,
  FETCH_QUERY_RESULTS,
  SET_GLOBAL_MAP_INFO,
  SET_SEARCH_FILTERS,
  SET_LISTING_TYPE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const setQueryResults = data => dispatch =>
  dispatch({
    type: FETCH_QUERY_RESULTS,
    payload: data,
  });

export const setListings = (data, propertyKey) => dispatch =>
  dispatch({
    type: FETCH_QUERY_RESULTS,
    payload: data[propertyKey],
  });

export const setListingType = listingType => dispatch =>
  dispatch({
    type: SET_LISTING_TYPE,
    payload: listingType,
  });

export const updateBoundingBox = (boundingBox, mapViewport) => dispatch =>
  dispatch({
    type: SET_GLOBAL_MAP_INFO,
    payload: {
      boundingBox,
      mapViewport,
    },
  });

export const setSearchFilters = filters => dispatch =>
  dispatch({
    type: SET_SEARCH_FILTERS,
    payload: filters,
  });
