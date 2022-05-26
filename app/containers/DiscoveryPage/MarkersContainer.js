import React, { Fragment, useState, createRef, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactMapGL, { Popup } from 'react-map-gl';

import { createStructuredSelector } from 'reselect';
// import { getListingItems } from './selectors';
import * as DiscoverPageActions from './actions';
import Marker from './Marker';
import PopoutContainer from './PopoutContainer';

export function MarkerContainer({ isListingVenues, listings }) {
  const [popupInfo, setPopupInfo] = useState(null);
  const refs = useRef(listings.map(() => createRef()));

  return (
    <Fragment>
      {isListingVenues &&
        listings.map((venue, i) => (
          <Marker
            id={venue.node.id}
            key={venue.node.id}
            onClick={setPopupInfo}
            ref={refs.current[i]}
            venueInfo={{ ...venue.node }}
          />
        ))}
      {popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.address.longitude}
          latitude={popupInfo.address.latitude}
          closeOnClick
          onClose={setPopupInfo}
        >
          <PopoutContainer venueInfo={popupInfo} />
        </Popup>
      )}
    </Fragment>
  );
}

MarkerContainer.propTypes = {
  venueInfo: PropTypes.object.isRequired,
};

MarkerContainer.defaultProps = {};

const mapStateToProps = createStructuredSelector({
  // listings: getListingItems,
});

const mapDispatchToProps = {
  setQueryData: DiscoverPageActions.setQueryResults,
  setListingData: DiscoverPageActions.setListings,
  setBoundingBox: DiscoverPageActions.updateBoundingBox,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkerContainer);
