/**
 *
 * Tests for Calendly
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
// import 'jest-dom/extend-expect'; // add some helpful assertions

import { Calendly } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

describe('<Calendly />', () => {
  it('Expect to have additional unit tests specified', () => {
    expect(true).toEqual(true);
  });
});
