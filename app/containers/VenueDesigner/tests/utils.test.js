import { mergeVenueItemUpdateSchema } from 'containers/VenueDesigner/utils';
import { VENUE_ITEM_MAP } from './testData';

describe('VenueDesigner utils', () => {
  it('mergeVenueItemUpdateSchema should merge in label field', () => {
    const updatedVenueMap = mergeVenueItemUpdateSchema(VENUE_ITEM_MAP);
    const labelField = updatedVenueMap[
      '222becb3-8157-48fa-93e3-ac38669f879b'
    ].fields.find(fld => fld.label === 'Label');
    expect(labelField).toBeDefined();
  });

  it('mergeVenueItemUpdateSchema should not override existing field definitions', () => {
    const updatedVenueMap = mergeVenueItemUpdateSchema(VENUE_ITEM_MAP);
    const curveField = updatedVenueMap[
      '222becb3-8157-48fa-93e3-ac38669f879b'
    ].fields.find(fld => fld.label === 'Curve');
    expect(curveField.value).toBe(1);
  });
});
