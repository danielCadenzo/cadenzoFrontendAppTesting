'use es6';

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, { Popup } from 'react-map-gl';
import mapBoxStyles from 'static/mapbox/style.json';
import { useDebounce, useDidMount } from 'utils/customHooks';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { getListingItems } from './selectors';
import * as DiscoverPageActions from './actions';
import MarkersContainer from './MarkersContainer';

const Wrapper = styled.div`
  position: sticky !important;
  top: 0 !important;
  z-index: 1 !important;
  width: 100% !important;
  display: inline-block !important;
  height: 100% !important;
  overflow: hidden;
`;

const CloseMap = styled.span`
  z-index: 11;
  position: absolute;
  margin: 8px;
  border-radius: 4px;
  color: black;
  background-color: #EDEDED;
  padding: 10px;
`

export function Map({
  children,
  latitude,
  longitude,
  getBoundingBox,
  listings,
  overloadViewport,
  getViewport,
  toggleMap,
}) {
  const [viewport, setViewport] = React.useState({
    latitude,
    longitude,
    zoom: 9,
    ...overloadViewport,
  });
  const mapRef = useRef(null);
  const didMount = useDidMount();
  const debouncedViewPortValue = useDebounce(viewport.latitude, 2000);

  useEffect(() => {
    if (getBoundingBox) {
      getBoundingBox(mapRef.current.getMap().getBounds(), viewport);
    }
  }, [debouncedViewPortValue]);

  useEffect(() => {
    setViewport({
      ...viewport,
      latitude,
      longitude,
    });
  }, [latitude, longitude]);

  useEffect(() => {
    if (didMount)
      getBoundingBox(mapRef.current.getMap().getBounds(), {
        ...viewport,
        ...overloadViewport,
      });
  }, [didMount]);

  return (
    <Wrapper>
      <CloseMap onClick={toggleMap}>X</CloseMap>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={mapBoxStyles}
        ref={mapRef}
        className="full-width full-height"
        mapboxApiAccessToken="pk.eyJ1IjoidHJveS1jYWRlbnpvIiwiYSI6ImNrdDlkeWgwcjFhdTMycG4xaGd6MmpvdnMifQ.SPZfl2eGXINdUJYYa8BfCg"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        {listings.length > 0 && (
          <MarkersContainer listings={listings} isListingVenues />
        )}
      </ReactMapGL>
    </Wrapper>
  );
}

Map.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  markers: PropTypes.array,
  getBoundingBox: PropTypes.func,
  listings: PropTypes.array.isRequired,
};

Map.defaultProps = {
  latitude: 36.15398,
  longitude: -95.992775,
};

const mapStateToProps = createStructuredSelector({
  listings: getListingItems,
});

const mapDispatchToProps = {
  setQueryData: DiscoverPageActions.setQueryResults,
  setListingData: DiscoverPageActions.setListings,
  setBoundingBox: DiscoverPageActions.updateBoundingBox,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map);
