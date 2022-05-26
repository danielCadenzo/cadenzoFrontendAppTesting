import React, { useMemo, useCallback, useState } from 'react';
import Input from 'components/Form/InputField';
import Checkbox from 'components/Form/Checkbox';
import Label from 'components/Form/Label';
import { useForm } from 'react-form';
import Button from 'components/Button';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import { Checkbox as MuiCheckbox, FormControlLabel } from '@material-ui/core';
import { isEqual } from 'lodash';

function SlotDetailForm({
  slotDetail,
  onSubmit,
  onClose,
  profileDefaultLocation,
  profileIsArtist,
}) {
  const defaultValues = useMemo(
    () => ({
      guarantee: 0,
      doorSplit: 25,
      isNegotiable: true,
      location: profileDefaultLocation,
      ...slotDetail,
    }),
    [],
  );
  const { Form, values, setFieldValue } = useForm({
    defaultValues,
    onSubmit,
  });

  const [useDefaultLocation, setUseDefaultLocation] = useState(
    !slotDetail ||
      !slotDetail.location ||
      isEqual(slotDetail.location, profileDefaultLocation),
  );

  const handleFormSubmit = useCallback(() => {
    if (useDefaultLocation) {
      values.location = profileDefaultLocation;
    }
    onSubmit(values);
    onClose();
  }, [values, useDefaultLocation]);

  const onChangeLocation = addressNode => {
    setFieldValue('location', addressNode);
  };

  return (
    <div className="d-flex flex-column p-3">
      <Form>
        <div className="d-flex flex-wrap flex-items-center">
          <Label> Artist Guarantee: </Label>
          <div className="d-flex flex-items-center">
            <p>$</p>
            <Input
              className="my-2 ml-1 full-width"
              name="guarantee"
              type="number"
              defaultValue="0"
              placeholder="$300"
            />
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <Label> Artist Door Split: </Label>
          <span className="d-flex flex-items-center">
            <Input
              className="my-2 mr-2 full-width"
              name="doorSplit"
              placeholder="Door split %"
              defaultValue="0"
              type="number"
              max={100}
              min={0}
            />
            <p>%</p>

            <div className="d-flex full-width ml-4 flex-shrink-0">
              <p className="pr-2">Venue Split: </p>
              <p> {100 - values.doorSplit || 0}%</p>
            </div>
          </span>
        </div>
        <Checkbox
          className="my-2"
          field="isNegotiable"
          checked={values.isNegotiable}
          value={values.isNegotiable}
          label="Is This Slot Negotiable? (Negotiable offers receive more requests)"
        />

        {profileIsArtist && (
          <div className="d-flex flex-column my-2">
            <FormControlLabel
              control={
                <MuiCheckbox
                  checked={!useDefaultLocation}
                  onChange={() => setUseDefaultLocation(!useDefaultLocation)}
                  value={!useDefaultLocation}
                />
              }
              label="Location (Are you going to be in a different city)"
            />
            {!useDefaultLocation && (
              <LocationSelect showCitiesAndPlaces onChange={onChangeLocation} />
            )}
          </div>
        )}
      </Form>

      <div className="d-flex">
        <Button onClick={handleFormSubmit}>
          {' '}
          {slotDetail ? <span>Edit</span> : <span>Add </span>}{' '}
        </Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

export default SlotDetailForm;
