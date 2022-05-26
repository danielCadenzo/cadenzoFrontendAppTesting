/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/**
 *
 * DiscoveryPage
 *
 */

import React, { memo, useCallback, useEffect, useState, Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';

import { useInjectReducer } from 'utils/injectReducer';
import { createGQLQuery } from 'data/api';
import MobileDrawer from 'components/MobileDrawer';
import * as AuthSelectors from 'data/selectors/authSelectors';
import Button from 'components/Button';
import { FormattedMessage } from 'react-intl';
import Map from './Map';
import {
  getListingItems,
  getQueryResults,
  getMapViewport,
  getBoundingBox,
  getSearchFilters,
  getListingSearchType,
} from './selectors';
import reducer from './reducer';
import messages from './messages';
import { PRIMARY_SEARCH_TYPES } from './constants';
import Sidebar from './DiscoverySidebar';
import * as DiscoverPageActions from './actions';
import { LUXON_ISO_DATE_FORMAT } from '../../utils/dates';
import ProfileRequestModal from './ProfileRequestModal';
import VenueListingContainer from './VenueListingContainer';
import ArtistListingContainer from './ArtistListingContainer';
import { radiusBoundingBoxFromPoint } from './utils';

const LIST_SIZE = 15;

const OverflowContainer = styled.div`
  height: calc(100% - 63px) !important;
  //overflow: hidden !important;
  max-height: calc(100% - 63px) !important;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: block;
  flex-direction: column;
  background: #f6f6fa;
  width: 100%;
  //height: 236px;
  padding: 24px;
`;

const HeaderTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
  height: fit-content;
  margin-bottom: 20px;
`;

const ButtonStyling = styled.button`
  @media (max-width: 400px) {
    visibility: hidden !important;
    display: none !important;
  }
`;

const TextButton = styled(Button)`
  color: #adb5bd;
  border: none;
  background: none;
  padding: 0px;
  font-size: 16px;
`;

const PaginationContainer = styled.div`
  display: flex;
  padding-left: 45px;
  padding-right: 45px;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 25px;
`;

const PaginationHeaderText = styled.h3`
  font-size: 18px;
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  @media (max-width: 600px) {
    max-width: 100%;
    bottom: 0;
    left: 0;
    position: fixed;
    background-color: #22af9a;
    height: 100%;
  }
`;

const ListingWrapper = styled.div`
display: flex;
background-color: white;
width: ${({ mapIsOpen }) =>  mapIsOpen ? '50%' : '100%'};
overflow-y: auto;
`

const VENUE_QUERY = `
   query DiscoveryPageVenueQuery(
     $swLng: Float
     $swLat: Float
     $neLng: Float
     $neLat: Float
     $genres: String
     $amenities: String
     $availabilityBetween: String
     $startCursor: String = ""
     $endCursor: String = ""
     $first: Int
   ) {
     venues(
       amenities: $amenities
       genres: $genres
       swLng: $swLng
       swLat: $swLat
       neLng: $neLng
       neLat: $neLat
       availabilityBetween: $availabilityBetween
       first: $first
       after: $startCursor
       before: $endCursor
     ) {
       totalCount
       pageInfo {
         endCursor
         hasNextPage
         hasPreviousPage
         startCursor
       }
       edges {
         node {
           id
           name
           description
           anemities
           spaceType
           dailyBookingFee
           hourlyBookingFee
           capacity
           exactCapacity
           preferredPerformances
           address {
             longitude
             latitude
             raw
             formatted
             streetNumber
             route
           }
           images
           socialLinks
         }
       }
     }
   }
 `;

const ARTIST_QUERY = `
 query DiscoveryPageArtistQuery(
   $swLng: Float,
   $swLat: Float,
   $neLng: Float,
   $neLat: Float,
   $genres: String,
   $performanceTypes: String,
   $availabilityBetween: String
   $startCursor: String = "", $endCursor: String = "", $first: Int, $last: Int) {
   artists(
     performanceTypes: $performanceTypes
     genres: $genres
     swLng: $swLng
     swLat: $swLat
     neLng: $neLng
     neLat: $neLat
     availabilityBetween: $availabilityBetween
     first: $first
     last: $last
     after: $startCursor, 
     before: $endCursor) {
     pageInfo {
       endCursor
       hasNextPage
       hasPreviousPage
       startCursor
     }
     edges {
       node {
         name
         id
         featuredMedia
         socialLinks
         spotifyProfile
         instagramProfile
         soundcloudProfile
         twitterProfile
         youtubeProfile
         applemusicProfile
         bandcampProfile
         performanceTypes
         genres
         avatar
         description
         images
         hometown {
           raw
           streetNumber
           latitude
           longitude
           formatted
           locality {
             name
           }
         }
       }
     }
   }
 }
 `;

const getStoredCoords = () => {
  const value = localStorage.getItem('MAP_LNG_LAT');
  if (value) {
    const coords = JSON.parse(value);
    if (coords.lat && coords.lng) return coords;
  }
  return {
    lat: 36.15398,
    lng: -95.99277,
  };
};

export function DiscoveryPage({
  setQueryData,
  setSearchFilters,
  searchFilters,
  setGlobalMapInfo,
  listings,
  globalViewport,
  setSearchType,
  mapBoundingBox,
  data,
  activeProfileIsVenue,
  activeProfile,
}) {
  useInjectReducer({ key: 'discoveryPage', reducer });
  const propertyKey =
    dataType === PRIMARY_SEARCH_TYPES.VENUE ? 'venues' : 'artists';

  const [pageInfo, setPageInfo] = useState({
    startCursor: '',
    endCursor: '',
    first: 15,
    last: 0,
    pageIndex: 0,
  });
  const [pageCursorMap, setCursorMap] = useState({
    '0': pageInfo,
  });
  const [isMapOpen, setMapIsOpen] = useState(!activeProfileIsVenue);

  const [location, setLocation] = useState(getStoredCoords());
  const dataType = activeProfileIsVenue ? 'ARTIST' : 'VENUE';

  useEffect(() => {
    setQueryData({});
    const availabililty = searchFilters.availabilityBetween[0]
      ? `["${searchFilters.availabilityBetween[0].toFormat(
        LUXON_ISO_DATE_FORMAT,
      )}", "${searchFilters.availabilityBetween[1].toFormat(
        LUXON_ISO_DATE_FORMAT,
      )}"]`
      : '[]';

    const boundingBox = isMapOpen ? mapBoundingBox : radiusBoundingBoxFromPoint(location.lat, location.lng, searchFilters.mapRadius)
    
    createGQLQuery(
      dataType === PRIMARY_SEARCH_TYPES.VENUE ? VENUE_QUERY : ARTIST_QUERY,
      {
        startCursor: pageInfo.startCursor,
        endCursor: pageInfo.endCursor,
        first: LIST_SIZE,
        swLat: boundingBox._sw.lat,
        swLng: boundingBox._sw.lng,
        neLat: boundingBox._ne.lat,
        neLng: boundingBox._ne.lng,
        genres: searchFilters.genres.join(','),
        performanceTypes: searchFilters.performanceTypes.join(','),
        preferredPerformances: searchFilters.preferredPerformances.join(','),
        amenities: searchFilters.amenities.join(','),
        availabilityBetween: availabililty,
      },
    ).then(queryResults => {
      setQueryData(queryResults);
    });
  }, [
    pageInfo.startCursor,
    pageInfo.endCursor,
    pageInfo.first,
    mapBoundingBox._sw.lat,
    searchFilters.availabilityBetween,
    searchFilters.genres,
    searchFilters.amenities,
    searchFilters.performanceTypes,
    searchFilters.preferredPerformances,
    dataType,
    mapBoundingBox._sw.lng,
    mapBoundingBox._ne.lat,
    activeProfile,
    location.lat,
    location.lng,
    searchFilters.mapRadius,
  ]);

  // Accessing data from query
  const dataPageInfo =
    data && data[propertyKey] ? data[propertyKey].pageInfo : {};

  // keep track of cursor history
  useEffect(() => {
    const pageKey = pageInfo.pageIndex.toString();
    const newMap = { ...pageCursorMap };
    newMap[pageInfo.pageKey] = pageInfo;
    if (
      !pageCursorMap[pageKey] ||
      pageCursorMap[pageKey].startCursor !== newMap[pageKey].startCursor
    ) {
      setCursorMap(newMap);
    }
  }, [pageInfo.pageIndex, pageInfo]);

  const onNextPage = useCallback(() => {
    if (dataPageInfo.hasNextPage) {
      setPageInfo({
        startCursor: dataPageInfo.endCursor,
        endCursor: '',
        pageInfo: pageInfo.pageIndex + 1,
      });
    }
  }, [dataPageInfo, setPageInfo, pageInfo.pageIndex, dataPageInfo]);

  const onPrevPage = () => {
    if (dataPageInfo.hasPreviousPage) {
      const newIndex = pageInfo.pageIndex - 1;
      setPageInfo({
        endCursor: dataPageInfo.startCursor,
        startCursor: pageCursorMap[newIndex.toString()].startCursor,
        pageInfo: newIndex,
      });
    }
  };

  const toggleMap = () => setMapIsOpen(!isMapOpen);

  const onUpdateQueryBounds = useCallback((bounds, viewport) => {
    if (
      bounds._sw.lat !== mapBoundingBox._sw.lat ||
      bounds._sw.lng !== mapBoundingBox._sw.lng ||
      bounds._ne.lat !== mapBoundingBox._ne.lat ||
      bounds._ne.lng !== mapBoundingBox._ne.lng
    ) {
      if (!viewport) setGlobalMapInfo(bounds, viewport);
      else {
        setGlobalMapInfo(bounds, globalViewport);
      }
    }
  });

  useEffect(() => {
    setSearchType(dataType);
  }, [activeProfile]);

  return (
    <OverflowContainer className="d-flex">
      <Helmet>
        <title>Discovery Page | Cadenzo</title>
        <meta name="description" content="Find Venues and Artists near you" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <MobileDrawer />
      <Suspense fallback={<div className="h1">Loading</div>}>
        <Header>
          <HeaderTitle>
            {!activeProfileIsVenue ? (
              <FormattedMessage {...messages.venuesNearYou} />
            ) : (
              <FormattedMessage {...messages.artistsNearYou} />
            )}
          </HeaderTitle>
          {listings && (
            <Sidebar
              activeProfileIsVenue={activeProfileIsVenue}
              searchType={dataType}
              onFilterChange={setSearchFilters}
              setLocation={setLocation}
            />
          )}
        </Header>
      </Suspense>
      <PaginationContainer>
        <PaginationHeaderText>
          {activeProfileIsVenue
            ? <FormattedMessage {...messages.showingArtists}/>
            : <FormattedMessage {...messages.showingVenues} />}
        </PaginationHeaderText>
        <div>
          <ButtonStyling>
            <div>
              <TextButton
                onClick={onPrevPage}
                inverted={!!dataPageInfo.hasNextPage}
                disabled={!!dataPageInfo.hasNextPage}
              >
                Previous
              </TextButton>

              <TextButton
                onClick={onNextPage}
                inverted={!!dataPageInfo.hasNextPage}
                disabled={!!dataPageInfo.hasNextPage}
              >
                Next
              </TextButton>
            </div>
          </ButtonStyling>
          {!activeProfileIsVenue && !isMapOpen && <button className='color-primary' onClick={toggleMap} type="button"> Show map </button>}
        </div>

      </PaginationContainer>
      <main className="position-relative d-flex full-width full-height bg-white flex-shrink-0">
        <ListingWrapper mapIsOpen={isMapOpen && !activeProfileIsVenue}>
          {listings && activeProfileIsVenue && (
            <ArtistListingContainer
              listings={listings}
            />
          )}
          { listings && !activeProfileIsVenue && (
            <VenueListingContainer listings={listings}  />
          )}

          { listings.length === 0 && <div className='f3 full-width text-center py-4'>No Listings</div>}
        </ListingWrapper>

        {!activeProfileIsVenue && isMapOpen && (
          <Wrapper className="half-width full-height bg-white pr-1">
            <Map
              setLocation={setLocation}
              longitude={location.lng}
              latitude={location.lat}
              getBoundingBox={onUpdateQueryBounds}
              overloadViewport={globalViewport}
              isListingVenues={!activeProfileIsVenue}
              toggleMap={toggleMap}
            />
          </Wrapper>
        )}
      </main>
      <div className="d-flex full-width flex-justify-right p-4 bg-white">
        <ProfileRequestModal
          venueIsSearchType={!activeProfileIsVenue}
          searchType={dataType}
        />
      </div>
    </OverflowContainer>
  );
}

DiscoveryPage.propTypes = {
  activeProfile: PropTypes.object,
  setQueryData: PropTypes.func.isRequired,
  setSearchFilters: PropTypes.func.isRequired,
  searchFilters: PropTypes.func.isRequired,
  setGlobalMapInfo: PropTypes.func.isRequired,
  setListingType: PropTypes.func,
  listings: PropTypes.array.isRequired,
  globalViewport: PropTypes.object.isRequired,
  mapBoundingBox: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  activeProfileIsVenue: PropTypes.bool.isRequired,
  setSearchType: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  listings: getListingItems,
  data: getQueryResults,
  globalViewport: getMapViewport,
  mapBoundingBox: getBoundingBox,
  searchFilters: getSearchFilters,
  searchType: getListingSearchType,
  activeProfileIsVenue: AuthSelectors.getIsActiveProfileAnVenue,
  activeProfile: AuthSelectors.getActiveProfile,
});

const mapDispatchToProps = {
  setQueryData: DiscoverPageActions.setQueryResults,
  setListingData: DiscoverPageActions.setListings,
  setListingType: DiscoverPageActions.setListingType,
  setGlobalMapInfo: DiscoverPageActions.updateBoundingBox,
  setSearchFilters: DiscoverPageActions.setSearchFilters,
  setSearchType: DiscoverPageActions.setListingType,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DiscoveryPage);
