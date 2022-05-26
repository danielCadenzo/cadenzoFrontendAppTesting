import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { PRIMARY_SEARCH_TYPES } from './constants';

/**
 * Direct selector to the discoveryPage state domain
 */

const selectDiscoveryPageDomain = state => state.discoveryPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DiscoveryPage
 */

const makeSelectDiscoveryPage = () =>
  createSelector(
    selectDiscoveryPageDomain,
    substate => substate,
  );

export const getQueryResults = createSelector(
  selectDiscoveryPageDomain,
  discoveryPage => {
    const { queryResults } = discoveryPage;
    return queryResults;
  },
);

export const getListingSearchType = createSelector(
  selectDiscoveryPageDomain,
  discoveryPage => discoveryPage.listingType,
);

export const getListingItems = createSelector(
  selectDiscoveryPageDomain,
  discoveryPage => {
    const { queryResults, listingType } = discoveryPage;
    if (!queryResults.venues && !queryResults.artists) return [];
    const isVenueListings = listingType === PRIMARY_SEARCH_TYPES.VENUE;
    if (isVenueListings) return queryResults.venues && queryResults.venues.edges;
    if (!isVenueListings && !queryResults.artists) return [];
    return queryResults.artists.edges.reduce((arr, nodeItem) => {
      const fixedNode = JSON.parse(JSON.stringify(nodeItem));
      // eslint-disable-next-line no-param-reassign
      fixedNode.node.address = { ...fixedNode.node.hometown };
      arr.push(fixedNode);
      return arr;
    }, []);
  },
);

export const getBoundingBox = createSelector(
  selectDiscoveryPageDomain,
  discoveryPage => {
    const { boundingBox } = discoveryPage;
    return boundingBox;
  },
);

export const getMapViewport = createSelector(
  selectDiscoveryPageDomain,
  discoveryPage => {
    const { mapViewport } = discoveryPage;
    return mapViewport;
  },
);

export const getSearchFilters = createSelector(
  selectDiscoveryPageDomain,
  discoveryPage => {
    const { searchFilters } = discoveryPage;
    return searchFilters;
  },
);

export default makeSelectDiscoveryPage;
export { selectDiscoveryPageDomain };
