'use es6';

import * as React from 'react';
import { Marker } from 'react-map-gl';
import PropTypes from 'prop-types';
import locationPin from 'images/location_pin_64x64.png';
function MapMarker({ venueInfo, onClick }) {
  const {
    address: { latitude, longitude },
  } = venueInfo;

  return (
    <Marker offsetTop={-32} longitude={longitude} latitude={latitude}>
      <img
        height={32}
        width={32}
        onClick={() => onClick(venueInfo)}
        src={locationPin}
      />
    </Marker>
  );
}

MapMarker.propTypes = {
  venueInfo: PropTypes.object.isRequired,
};

export default MapMarker;
