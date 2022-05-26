import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
import Enzyme, { shallow, mount } from 'enzyme';
// import 'jest-dom/extend-expect'; // add some helpful assertions
import { noop } from 'constants/tests/utils';
import Adapter from 'enzyme-adapter-react-16';
import ReactMapGL from 'react-map-gl';
import { Map } from '../Map';
import { MarkerContainer as MarkersContainer } from '../MarkersContainer';
import Marker from '../Marker';

Enzyme.configure({ adapter: new Adapter() });
const defaultProps = {
  isListingVenues: true,
  getBoundingBox: noop,
  listings: [],
  getViewport: noop,
  latitude: -95.99277,
  longitude: 36.15398,
  globalViewport: {},
  mapBoundingBox: {
    _sw: {
      lng: -95.99277,
      lat: 36.15398,
    },
    _ne: {
      lng: -95.09277,
      lat: 36.9398,
    },
  },
};

describe('Discovery Map', () => {
  it('Should render with no listings', () => {
    const spy = jest.spyOn(defaultProps, 'getBoundingBox');
    const wrapper = shallow(<Map {...defaultProps} />);
    expect(wrapper.exists(MarkersContainer)).toEqual(false);
  });

  it('Should render map', () => {
    const wrapper = shallow(<Map {...defaultProps} />);
    expect(wrapper.exists(ReactMapGL)).toEqual(true);
  });

  it.skip('Show MarkerContainer when having listings', () => {
    const spy = jest.spyOn(defaultProps, 'getBoundingBox');
    const wrapper = shallow(
      <Map
        {...defaultProps}
        listings={[
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
                longitude: -95.992775,
                latitude: 36.15398,
                raw: 'Test Ave',
                formatted: 'Test Ave',
                streetNumber: '1222',
                route: 'Test Ave',
              },
              images: [],
              socialLinks: [],
            },
          },
        ]}
      />,
    );
    expect(wrapper.exists(MarkersContainer)).toEqual(true);
  });
});

describe('MarkersContainer', () => {
  it('Should not render', () => {
    const spy = jest.spyOn(defaultProps, 'getBoundingBox');
    const wrapper = shallow(<MarkersContainer {...defaultProps} />);
    expect(wrapper.exists(Marker)).toEqual(false);
  });

  it('Show MarkerContainer when having listings', () => {
    const spy = jest.spyOn(defaultProps, 'getBoundingBox');
    const wrapper = shallow(
      <MarkersContainer
        {...defaultProps}
        listings={[
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
        ]}
      />,
    );
    expect(wrapper.exists(Marker)).toEqual(true);
  });
});
