'use es6';

import React, { useState, useCallback } from 'react';
import { useForm, useField } from 'react-form';
import H4 from 'components/H4';
import { IconButton } from '@material-ui/core';
import { EventTypes } from 'containers/App/constants';
import { uploadImage } from 'data/clients/eventClient';
import { usePrevious } from 'utils/customHooks';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import styled from 'styled-components';
import { cadenzoPrimary } from 'utils/CssVariables';
import Button from 'components/Button';
import * as selectedEventClient from 'data/clients/selectedEventClient';
import DateTimeField from 'components/Form/DateTimeField';
import LocationField from 'components/Form/LocationField';
import Label from 'components/Form/Label';
import FormControl from 'components/Form/FormControl';
import FormErrorContainer from 'components/Form/FormErrorContainer';
import InputField from 'components/Form/InputField';
import { redirectToUrl } from 'utils/helpers';
import Routes from 'data/Routes';
import CropModal from './CropModal';

const Box = styled.div`
  display: flex;
  flex-align-items: center;
  flex-justify-content: center;
  width: 400px;
  height: 200px;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23333' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")
  ${props => (props.background && `, url(${props.background});`) || ';'}
  background-size: cover, cover;
  border-radius: 10px;

  & .replace-box {
    display: none !important;
    visibility: hidden;
  }

  &:hover {
    background-color: #252424c9;
  }

  &:hover .replace-box {
    display: flex !important;
    z-index: 2;
    visibility: visible;
    color: white;
  }
`;

const BoxOverlay = styled.div`
  width: 100%;
  height: 100%;
  text-align: -webkit-center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #252424c9 !important;
  }
`;

const RadioButton = styled.button`
  border: 3px solid ${cadenzoPrimary};
  padding: 12px 20px;
  font-size: 18px;
  background-color: ${({ isSelected }) =>
    isSelected ? cadenzoPrimary : 'white'};
  color: ${({ isSelected }) => (isSelected ? 'white' : cadenzoPrimary)};
  ${({ isRight }) =>
    isRight ? `border-radius: 0 20px 20px 0;` : `border-radius: 20px 0 0 20px`}
`;

const FILENAME_PREFIX = 'some-cool-image';

function OnlineRadioGroup() {
  const { setValue, value, getInputProps } = useField('isOnline', {
    defaultValue: true,
  });

  const handleChange = useCallback(evt => {
    const isOnline = evt.target.value === 'Yes';
    setValue(isOnline);
  }, []);

  return (
    <div className="d-flex my-1">
      <RadioButton
        {...getInputProps()}
        onClick={handleChange}
        value="No"
        type="button"
        isRight={false}
        isSelected={!value}
      >
        No
      </RadioButton>
      <RadioButton
        {...getInputProps()}
        onClick={handleChange}
        value="Yes"
        type="button"
        isSelected={value}
        isRight
      >
        Yes
      </RadioButton>
    </div>
  );
}

function EventBasicsForm() {
  const onCreateEvent = useCallback(form => {
    selectedEventClient.createEvent(form).then(data => {
      if (data.createEvent && data.createEvent.success) {
        const { id } = data.createEvent.event;
        redirectToUrl(Routes.eventDashboard(id));
      }
    });
  });

  const {
    Form,
    setFieldValue,
    meta: { error, submissionAttempts },
  } = useForm({
    onSubmit: onCreateEvent,
    validate: async (values, instance) => {
      const { startDate, endDate } = values;
      if (!values.coverUrl) {
        return 'Must have Cover Image';
      }
      if (startDate.diff(endDate).milliseconds >= 0) {
        return 'End date cannot before start date';
      }
      return null;
    },
    debugForm: false,
  });

  const [showCropModal, updateShowCropModal] = useState(false);
  const ref = React.createRef();
  const [imageSrc, updateImageSrc] = useState(null);
  const [imageType, updateImageType] = useState(null);
  const [coverImageSrc, setCoverImage] = useState(undefined);
  const prevSubmissionAttempts = usePrevious(submissionAttempts);

  const onUpdateEventImage = imageDataUri => {
    setCoverImage(imageDataUri);
    uploadImage(imageDataUri, `${FILENAME_PREFIX}.${imageType}`).then(data => {
      const { updateEventCover } = data;
      if (updateEventCover && updateEventCover.success) {
        setFieldValue('coverUrl', updateEventCover.coverUrl);
      }
    });
  };

  const uploadFileToServer = event => {
    const file = event.target.files[0];
    const { type } = file;
    const imageType = type.replace('image/', '');
    updateImageType(imageType);
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    // eslint-disable-next-line func-names
    reader.onload = function() {
      // convert to base64
      updateImageSrc(btoa(reader.result));
      updateShowCropModal(true);
    };
    // eslint-disable-next-line func-names
    reader.onerror = function() {
      // eslint-disable-next-line no-console
      console.info('there are some problems');
    };
  };

  return (
    <Form>
      {error && prevSubmissionAttempts < submissionAttempts && (
        <div className="pl-4">
          <FormErrorContainer> {error} </FormErrorContainer>
        </div>
      )}
      <FormControl>
        <div>
          <div className="d-flex flex-column my-2">
            <Label> Event Title </Label>
            <InputField
              name="title"
              style={{ maxWidth: 300 }}
              placeholder="Event Name"
            />
          </div>

          <div>
            <div className="mb-2">
              <Label> Start Date </Label>
              <DateTimeField
                showTimeSelect
                timeIntervals={5}
                timeFormat="hh:mm aa"
                name="startDate"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>

            <div className="my-1">
              <Label className="my-1"> End Date </Label>
              <DateTimeField
                showTimeSelect
                timeIntervals={5}
                name="endDate"
                timeFormat="hh:mm aa"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
          </div>

          <div className="">
            <Label className="my-1">Location</Label>
            <LocationField name="address" className="my-1" />
          </div>

          <div className="d-flex my-3 flex-column">
            <Label> Event Type </Label>
            <select
              defaultValue="ArtsAndEntertainment"
              onChange={e => setFieldValue('type', e.target.value)}
            >
              {Object.keys(EventTypes).map(key => (
                <option value={key} label={EventTypes[key]} />
              ))}
            </select>
          </div>

          <Label className="mt-3">Is This Event Online?</Label>
          <OnlineRadioGroup />

          <CropModal
            imageType={imageType}
            isOpen={showCropModal}
            onClose={() => updateShowCropModal(false)}
            imageBase64={`${imageSrc}`}
            onSaveImage={onUpdateEventImage}
          />
        </div>
        <div className="">
          <div className="d-flex flex-column">
            <H4 className="ml-3 work-sans-black"> Upload Cover Image</H4>
            <input
              onChange={uploadFileToServer}
              type="file"
              accept=".jpg,.jpeg,.png"
              id="file"
              ref={ref}
              style={{ display: 'none' }}
            />
            <Box
              onClick={() => ref.current.click()}
              className="flex-justify-center m-3"
              background={coverImageSrc}
            >
              <BoxOverlay>
                <div className="replace-box d-flex flex-self-center flex-column">
                  <IconButton className="fit-content-height">
                    <InsertPhotoIcon style={{ color: 'white' }} />
                  </IconButton>
                  Replace
                </div>
              </BoxOverlay>
            </Box>
          </div>
          <div className="d-flex flex-justify-end">
            <Button type="submit">Next</Button>
          </div>
        </div>
      </FormControl>
    </Form>
  );
}

export default EventBasicsForm;
