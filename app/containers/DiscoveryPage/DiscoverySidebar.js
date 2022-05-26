'use es6';

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useWindowDimensions } from 'utils/customHooks';
import BaseFilterForm from './BaseFilterForm';
import MobileDrawer from '../../components/MobileDrawer';

const HideOnMobile = styled.div`
  @media (max-width: 400px) {
    visibility: hidden !important;
    display: none !important;
  }
`;

export function DiscoverySidebar({
  searchType,
  setLocation,
  setSearchType,
  onFilterChange,
  activeProfileIsVenue,
}) {
  const { width } = useWindowDimensions();
  const onChangeLocation = addressNode => {
    setLocation({
      lat: addressNode.latitude,
      lng: addressNode.longitude,
    });
  };

  const filters = (
    <BaseFilterForm
      onChange={onFilterChange}
      searchType={searchType}
      onSearchChange={setSearchType}
      activeProfileIsVenue={activeProfileIsVenue}
      onChangeLocation={onChangeLocation}
    />
  );

  return (
    <div>
      <div className="full-width">
        {width > 400 && <HideOnMobile>{filters}</HideOnMobile>}
        {width <= 400 && <MobileDrawer drawerContent={<>{filters}</>} />}
      </div>
    </div>
  );
}

DiscoverySidebar.propTypes = {
  activeProfileIsVenue: PropTypes.bool,
  searchType: PropTypes.string,
  setLocation: PropTypes.func.isRequired,
  setSearchType: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default DiscoverySidebar;
