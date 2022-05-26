/**
 *
 * Tests for DiscoveryPage
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
import Enzyme, { shallow, mount } from 'enzyme';
// import 'jest-dom/extend-expect'; // add some helpful assertions
import { noop } from 'constants/tests/utils';
import Adapter from 'enzyme-adapter-react-16';
import { DiscoveryPage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';
import Sidebar from '../VenueSidebar';

Enzyme.configure({ adapter: new Adapter() });
const defaultProps = {
  setQueryData: noop,
  setGlobalMapInfo: noop,
  listings: [],
  data: {},
  globalViewport: {},
  mapBoundingBox: {
    _sw: {
      lng: -95.99277,
      lat: 36.15398,
    },
    _ne: {
      lng: -95.99277,
      lat: 36.15398,
    },
  },
};

describe('<DiscoveryPage />', () => {
  it('Should render Map and Sidebar', () => {
    const spy = jest.spyOn(defaultProps, 'setQueryData');
    const wrapper = mount(<DiscoveryPage {...defaultProps} />);
    expect(wrapper.contains(<Sidebar />)).to.equal(true);
  });

  it('Expect to have additional unit tests specified', () => {
    expect(true).toEqual(true);
  });
});
