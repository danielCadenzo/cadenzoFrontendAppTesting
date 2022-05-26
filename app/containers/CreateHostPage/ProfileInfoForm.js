'use es6';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-form';
import H2 from 'components/H2';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import FormControl from 'components/Form/FormControl';
import InputField from 'components/Form/InputField';
import TextField from 'components/Form/TextField';
import SelectField from 'components/Form/SelectField';
import MultiSelectField from 'components/Form/MultiSelectField';
import ImageUploadField from 'components/Form/ImageUploadField';
import Label from 'components/Form/Label';
import Button from 'components/Button';
import { PERFORMANCE_TYPES } from 'containers/CreateArtistPage/constants';
import { injectIntl, FormattedMessage } from 'react-intl';
import Uploader from 'components/Uploader';
import styled from 'styled-components';
import {
  CapacityAmounts,
  AmenityTypes,
  SpaceTypes,
} from 'containers/CreateHostPage/constants';
import messages from './messages';

const LocationField = styled(LocationSelect)`
  max-width: 300px !important;
  min-width: 200px !important;
`;

function ProfileInfoForm(props) {
  const { profileData, intl, isEditingHostProfile } = props;
  const defaultValues = useMemo(
    () => ({
      preferredPerformances: [],
      anemities: [],
      images: [],
      spaceType: 'BAR',
      ...profileData,
    }),
    [],
  );

  const PERFORMANCE_OPTIONS = useMemo(
    () =>
      Object.keys(PERFORMANCE_TYPES).map(key => ({
        label: PERFORMANCE_TYPES[key],
        value: key,
      })),
    [],
  );

  const SPACE_OPTIONS = useMemo(() =>
    Object.keys(SpaceTypes).map(optionKey => ({
      label: SpaceTypes[optionKey],
      value: optionKey,
    })),
  );

  const CAPACITY_OPTIONS = useMemo(
    () =>
      Object.keys(CapacityAmounts).map(optionKey => ({
        label: CapacityAmounts[optionKey],
        value: optionKey,
      })),
    [],
  );

  const AMENITY_OPTIONS = useMemo(
    () =>
      Object.keys(AmenityTypes).map(optionKey => ({
        label: intl.formatMessage(messages[AmenityTypes[optionKey]]),
        value: optionKey,
      })),
    [],
  );

  const handleSubmit = values => {
    props.onFormSubmit(values);
  };
  const { Form, setFieldValue, values } = useForm({
    defaultValues,
    onSubmit: async values => handleSubmit(values),
    debugForm: false,
  });

  const onChangeLocation = newValue => {
    setFieldValue('address', newValue);
  };

  const onFileUploadUpdate = fileList => {
    setFieldValue('images', fileList);
  };

  const onExactCapacityUpdate = maxCapacity => {
    if (maxCapacity <= 20) return setFieldValue('capacity', 'INTIMATE');
    if (maxCapacity <= 60) return setFieldValue('capacity', 'SMALL');
    if (maxCapacity <= 120) return setFieldValue('capacity', 'MEDIUM');
    if (maxCapacity <= 300) return setFieldValue('capacity', 'LARGE');
    if (maxCapacity >= 300) return setFieldValue('capacity', 'VERY_LARGE');
  };

  const existingVenuePhotos = (profileData && profileData.images) || [];

  return (
    <Form>
      <div
        style={{ backgroundColor: '#fafafa' }}
        className="d-flex flex-justify-center"
      >
        <FormControl>
          <div>
            <div className="d-flex flex-justify-between flex-wrap">
              <div>
                <H2>
                  {isEditingHostProfile && (
                    <FormattedMessage {...messages.headerEdit} />
                  )}
                  {!isEditingHostProfile && (
                    <FormattedMessage {...messages.headerCreate} />
                  )}
                </H2>
                <div className="d-flex flex-column my-2">
                  <Label> Venue Name </Label>
                  <InputField
                    required
                    name="name"
                    style={{ maxWidth: 300 }}
                    placeholder="Venue Name"
                  />
                </div>

                <div className="d-flex flex-column my-2">
                  <Label> Address </Label>
                  <LocationField
                    onChange={onChangeLocation}
                    required
                    name="address"
                    className="my-1"
                    defaultValue={
                      values.address ? values.address.formatted : null
                    }
                    defaultOptions={[{ ...values.address }]}
                  />
                </div>
              </div>
              <div className="d-flex flex-column flex-items-center my-2">
                <Label> Venue Profile Picture </Label>
                <ImageUploadField name="avatar" required />
              </div>
            </div>

            <div className="d-flex flex-column my-2">
              <Label> What amenities does your venue provide? </Label>
              <MultiSelectField
                isMulti
                name="anemities"
                options={AMENITY_OPTIONS}
              />
            </div>

            <div className="d-flex flex-column my-2">
              <Label> What's your venue's max capacity?</Label>
              <InputField
                onUpdate={onExactCapacityUpdate}
                type="number"
                name="maxCapacity"
                className="my-1"
              />
            </div>

            <div className="d-flex flex-column my-2">
              <Label> What category is your space? </Label>
              <div className="d-flex flex-wrap">
                <SelectField name="spaceType" options={SPACE_OPTIONS} />
              </div>
            </div>

            <div className="d-flex flex-column my-2">
              <Label> Describe your venue </Label>
              <TextField required name="description" className="my-1" />
            </div>

            <div>
              <Label> Upload venue photos (3 mininimum) </Label>
              <Uploader
                fileUrls={existingVenuePhotos}
                onUpdate={onFileUploadUpdate}
              />
            </div>
          </div>
          <div className="d-flex full-width flex-justify-end">
            <div className="d-flex">
              <Button className="p-4 work-sans-black" type="submit">
                {isEditingHostProfile && (
                  <FormattedMessage {...messages.submitTextEdit} />
                )}
                {!isEditingHostProfile && (
                  <FormattedMessage {...messages.submitTextCreate} />
                )}
              </Button>
            </div>
          </div>
        </FormControl>
      </div>
    </Form>
  );
}

ProfileInfoForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  profileData: PropTypes.object.isRequired,
  isEditingHostProfile: PropTypes.bool.isRequired,
  intl: PropTypes.object,
};

export default injectIntl(ProfileInfoForm);
