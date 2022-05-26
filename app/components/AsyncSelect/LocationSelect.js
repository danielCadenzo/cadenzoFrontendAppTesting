/* eslint-disable react/no-unused-state */

'use es6';

import AsyncSelect from 'react-select/async';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { createGQLQuery } from 'data/api';
import styled from 'styled-components';

const StyledSelect = styled(AsyncSelect)`
  padding: 8px;
  background-color: white;
  color: black;
  border-radius: 20px;
  max-width: 400px;
  min-width: 250px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;

  & .css-yk16xz-control {
    border: none;
  }

  @media (max-width: 400px) {
    border-radius: 20px;
    min-width: 65%;
  }
`;

const getAddressInputFromSearch = address => {
  const addressPlaceDetailMap = address.context.reduce((acc, currVal) => {
    const propertyKey = currVal.id.split('.')[0];
    acc[propertyKey] = currVal;
    return acc;
  }, {});
  return {
    raw: address.place_name,
    latitude: address.center[1],
    longitude: address.center[0],
    formatted: address.place_name,
    route: address.text,
    streetNumber: address.address,
    locality: {
      name: addressPlaceDetailMap.place.text,
      postalCode: addressPlaceDetailMap.postcode.text,
      state: {
        code: addressPlaceDetailMap.region.short_code,
        name: addressPlaceDetailMap.region.text,
        country: {
          code: addressPlaceDetailMap.country.short_code.toUpperCase(),
          name: addressPlaceDetailMap.country.text,
        },
      },
    },
  };
};

const parseCityFromSearch = place => {
  const addressPlaceDetailMap = place.context.reduce((acc, currVal) => {
    const propertyKey = currVal.id.split('.')[0];
    acc[propertyKey] = currVal;
    return acc;
  }, {});

  return {
    raw: place.place_name,
    latitude: place.center[1],
    longitude: place.center[0],
    formatted: place.place_name,
    route: null,
    streetNumber: null,
    locality: {
      name: place.text,
      postalCode: null,
      state: {
        code: addressPlaceDetailMap.region.short_code,
        name: addressPlaceDetailMap.region.text,
        country: {
          code: addressPlaceDetailMap.country.short_code.toUpperCase(),
          name: addressPlaceDetailMap.country.text,
        },
      },
    },
  };
};

const getAddressNodeFromSearch = node => {
  const placeType = node.place_type.shift();
  const isCity = placeType === 'place';
  return isCity ? parseCityFromSearch(node) : getAddressInputFromSearch(node);
};

const getLocationQuery = searchTypes => `query($address: String!, $searchTypes:[String]){
  getAddresses(rawAddress: $address, searchTypes: $searchTypes)
}`;

class WithCallbacks extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadAddresses = this.loadAddresses.bind(this);
    this.debouncedLoadAddress = debounce(this.loadAddresses, 250);
  }

  state = { inputValue: '' };

  handleInputChange = newValue => {
    this.setState({ inputValue: newValue });
  };

  loadAddresses = value => {
    const { showCitiesAndPlaces } = this.props;
    const addressEnums = showCitiesAndPlaces
      ? ['place', 'address']
      : ['address'];
    if (!value) return new Promise(() => []);
    return createGQLQuery(getLocationQuery(addressEnums), {
      address: value || '',
      searchTypes: addressEnums,
    }).then(data => {
      const { getAddresses } = data;
      const predictions = JSON.parse(getAddresses);
      const addresses = predictions.map(addy => getAddressNodeFromSearch(addy));
      return addresses;
    });
  };

  render() {
    const { onChange, className, defaultValue, defaultOptions } = this.props;
    return (
      <StyledSelect
        cacheOptions
        className={className}
        loadOptions={this.debouncedLoadAddress}
        onChange={onChange}
        defaultInputValue={defaultValue}
        defaultOptions={defaultOptions}
        getOptionLabel={option => option.formatted}
        getOptionValue={option => option.formatted}
        onInputChange={this.handleInputChange}
        placeholder="City, state, etc"
      />
    );
  }
}

WithCallbacks.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.any,
  defaultOptions: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  showCitiesAndPlaces: PropTypes.bool,
};

WithCallbacks.defaultProps = {
  showCitiesAndPlaces: false,
};

export default WithCallbacks;
