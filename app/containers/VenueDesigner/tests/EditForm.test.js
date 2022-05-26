/**
 *
 * Tests for VenueDesigner
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { IntlProvider } from 'react-intl';
import EditForm from 'containers/VenueDesigner/EditForm';
// import 'jest-dom/extend-expect'; // add some helpful assertions

import { noopFactory, render } from 'tests/testUtils';
import { VenueDesigner } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';
import { VENUE_ITEM_MAP } from './testData';

const selectedId = '222becb3-8157-48fa-93e3-ac38669f879b';

const defaultProps = {
  updateNodeField: noopFactory,
  removeVenueItem: noopFactory,
  cloneVenueItem: noopFactory,
  onCahnge: noopFactory,
  editTimeStamp: 1283298923,
  selectedNode: VENUE_ITEM_MAP[selectedId],
  selectedNodeId: selectedId,
  selectedNodeFields: VENUE_ITEM_MAP[selectedId].fields,
};

describe('<EditForm />', () => {
  it('Expect to not log errors in console', () => {
    const { baseElement } = render(<EditForm />, defaultProps);
    const spy = jest.spyOn(EditForm, 'onChange');
    const field = baseElement.querySelector('data-test-id="field-Label"');
    field.value += 'ndknfdlsknlf';
    expect(spy).toHaveBeenCalled();
  });
});
