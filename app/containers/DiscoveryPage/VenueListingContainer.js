'use es6';

import React from 'react';
import PropTypes from 'prop-types';
import { useWindowDimensions } from 'utils/customHooks';
import MobileDrawer from '../../components/MobileDrawer';
import VenueSidebarItem from './VenueSidebarItem';

export function VenueListingContainer({ listings }) {
  const { width } = useWindowDimensions();
  if (width < 600)
    return (
      <MobileDrawer
        alwaysShowPartial
        drawerContent={
          <div className="p-3">
            <p>
              <b> Show venues in selected area</b>
            </p>
          </div>
        }
      >
        {listings.length > 0 &&
          listings.map(nodeItem => (
            <VenueSidebarItem
              key={nodeItem.node.id}
              venue={{ ...nodeItem.node }}
              artist={{ ...nodeItem.node }}
            />
          ))}
      </MobileDrawer>
    );
  return (
    <div className="d-flex flex-wrap flex-justify-around">
      <>
        {listings.length > 0 &&
          listings.map(nodeItem => (
            <VenueSidebarItem
              key={nodeItem.node.id}
              venue={{ ...nodeItem.node }}
            />
          ))}
      </>
    </div>
  );
}

VenueListingContainer.propTypes = {
  listings: PropTypes.array,
};

export default VenueListingContainer;
