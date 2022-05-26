'use es6';

import React from 'react';
import PropTypes from 'prop-types';
import { useWindowDimensions } from 'utils/customHooks';
import MobileDrawer from '../../components/MobileDrawer';
import ArtistSidebarItem from './ArtistSidebarItem';

export function ArtistListingContainer({ listings }) {
  const { width } = useWindowDimensions();
  if (width < 600)
    return (
      <MobileDrawer
        alwaysShowPartial
        drawerContent={
          <div className="p-3">
            <p>
              <b> Show artists in selected area</b>
            </p>
          </div>
        }
      >
        {listings.length > 0 &&
          listings.map(nodeItem => (
            <ArtistSidebarItem
              key={nodeItem.node.id}
              artist={{ ...nodeItem.node }}
            />
          ))}
      </MobileDrawer>
    );
  return (
    <div className="d-flex full-width flex-wrap flex-justify-around">
      <>
        {listings.length > 0 &&
          listings.map(nodeItem => (
            <ArtistSidebarItem
              key={nodeItem.node.id}
              artist={{ ...nodeItem.node }}
            />
          ))}
      </>
    </div>
  );
}

ArtistListingContainer.propTypes = {
  listings: PropTypes.array,
};

export default ArtistListingContainer;
