'use es6';

import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL from 'react-map-gl';
import mapBoxStyles from 'static/mapbox/style.json';
import styled from 'styled-components';
import { useDebounce } from 'utils/customHooks';

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

function Map({
  children,
  latitude,
  longitude,
  getBoundingBox,
  overloadViewport,
  getViewport,
}) {
  const [viewport, setViewport] = React.useState({
    latitude,
    longitude,
    zoom: 10,
    ...(overloadViewport || {}),
  });

  const mapRef = useRef(null);
  const debouncedViewPortValue = useDebounce(viewport.latitude, 1000);

  useEffect(() => {
    getViewport(viewport);
    if (getBoundingBox) getBoundingBox(mapRef.current.getMap().getBounds());
  }, [debouncedViewPortValue]);

  useEffect(() => {
    setViewport({
      ...viewport,
      latitude,
      longitude,
    });
  }, [latitude, longitude]);

  return (
    <Wrapper>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={mapBoxStyles}
        className="full-width full-height"
        mapboxApiAccessToken="pk.eyJ1IjoidHJveS1jYWRlbnpvIiwiYSI6ImNrdDlkeWgwcjFhdTMycG4xaGd6MmpvdnMifQ.SPZfl2eGXINdUJYYa8BfCg"
        onViewportChange={viewport => setViewport(viewport)}
      >
        {children}
      </ReactMapGL>
    </Wrapper>
  );
}

Map.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  markers: PropTypes.array,
  getBoundingBox: PropTypes.func,
};

Map.defaultProps = {
  latitude: 36.15398,
  longitude: -95.992775,
};

export default Map;
