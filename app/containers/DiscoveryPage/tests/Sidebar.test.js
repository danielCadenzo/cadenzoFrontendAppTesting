import React from 'react';
import Enzyme, { shallow } from 'enzyme';
// import 'jest-dom/extend-expect'; // add some helpful assertions
import { noop } from 'constants/tests/utils';
import Adapter from 'enzyme-adapter-react-16';
import ProfileTypes from 'constants/ProfileTypes';
import { VenueListingContainer } from '../VenueListingContainer';
import { ArtistListingContainer } from '../ArtistListingContainer';
import VenueSidebarItem from '../VenueSidebarItem';
import ArtistSidebarItem from '../ArtistSidebarItem';
import { DiscoveryPage } from '../index';
import artistListings from './data/artistListings';

Enzyme.configure({ adapter: new Adapter() });
const defaultProps = {
  onChangeLocation: noop,
  searchType: ProfileTypes.VENUE,
  mapBoundingBox: {
    _sw: {
      lng: 0,
      lat: 0,
    },
    _ne: {
      lng: 0,
      lat: 0,
    },
  },
  mapViewport: {},
  setLocation: noop,
  items: [],
  setSearchType: noop,
  onFilterChange: noop,
  onPrevPage: noop,
  onNextPage: noop,
  hasPreviousPage: true,
  hasNextPage: true,
  setQueryData: noop,
  setSearchFilters: noop,
  searchFilters: noop,
  setGlobalMapInfo: noop,
  listings: [],
  globalViewport: {},
  data: {},
  activeProfileIsVenue: false,
  activeProfile: {},
};

const render = props => shallow(<DiscoveryPage {...defaultProps} {...props} />);

const renderVenueListingContainer = props =>
  shallow(<VenueListingContainer {...defaultProps} {...props} />);

const renderArtistListingContainer = props =>
  shallow(<ArtistListingContainer {...defaultProps} {...props} />);

describe('Discovery Sidebar', () => {
  it('Should render w/ no listings container', () => {
    const wrapper = render({
      listings: [
        {
          node: {
            id: 'oifncoivnw',
            name: 'Test',
            description: '',
            anemities: [],
            spaceType: 'RESTAURANT',
            dailyBookingFee: 0,
            hourlyBookingFee: 0,
            capacity: 'VERY_LARGE',
            exactCapacity: 600,
            preferredPerformances: [],
            address: {
              longitude: -95.99,
              latitude: 36.4,
              raw: 'Test Ave',
              formatted: 'Test Ave',
              streetNumber: '1222',
              route: 'Test Ave',
            },
            images: [],
            socialLinks: [],
          },
        },
      ],
    });
    expect(wrapper.exists(VenueListingContainer)).toEqual(true);
  });

  it('Show VenueListingContainer when having listings', () => {
    const wrapper = render({
      listings: [
        {
          node: {
            id: 'oifncoivnw',
            name: 'Test',
            description: '',
            anemities: [],
            spaceType: 'RESTAURANT',
            dailyBookingFee: 0,
            hourlyBookingFee: 0,
            capacity: 'VERY_LARGE',
            exactCapacity: 600,
            preferredPerformances: [],
            address: {
              longitude: -95.99,
              latitude: 36.4,
              raw: 'Test Ave',
              formatted: 'Test Ave',
              streetNumber: '1222',
              route: 'Test Ave',
            },
            images: [],
            socialLinks: [],
          },
        },
      ],
    });
    expect(wrapper.exists(VenueListingContainer)).toEqual(true);
  });

  it('Should render VenueSideItem when active profile is artist', () => {
    const wrapper = renderVenueListingContainer({
      activeProfileIsVenue: false,
      listings: [
        {
          node: {
            id: 'oifncoivnw',
            name: 'Test',
            description: '',
            anemities: [],
            spaceType: 'RESTAURANT',
            dailyBookingFee: 0,
            hourlyBookingFee: 0,
            capacity: 'VERY_LARGE',
            exactCapacity: 600,
            preferredPerformances: [],
            address: {
              longitude: -95.99,
              latitude: 36.4,
              raw: 'Test Ave',
              formatted: 'Test Ave',
              streetNumber: '1222',
              route: 'Test Ave',
            },
            images: [],
            socialLinks: [],
          },
        },
      ],
    });
    expect(wrapper.exists(VenueSidebarItem)).toEqual(true);
  });

  it('Should render ArtistSidebar item when ARTIST is the search type', () => {
    const wrapper = renderArtistListingContainer({
      activeProfileIsVenue: true,
      listings: artistListings,
    });
    expect(wrapper.exists(ArtistSidebarItem)).toEqual(true);
  });
});
