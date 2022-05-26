import React, { memo, useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import Button from 'components/Button';
import Input from 'components/Input';
import H4 from 'components/H4';
import { EventTypes } from 'containers/App/constants';
import DatePicker from 'react-datepicker';
import Modal from 'components/Modal';
import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';
import { updateEventCover } from 'data/clients/eventClient';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import { DateTime } from 'luxon';

const Box = styled.div`
  display: flex;
  flex-align-items: center;
  flex-justify-content: center;
  width: 400px;
  height: 200px;
  border: black 1px dotted;
  ${props => props.background && `background-image: url(${props.background});`}
  background-size: cover;

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

const CropModal = ({
  isOpen,
  onClose,
  imageBase64,
  imageType,
  onSaveImage,
}) => {
  const cropperRef = useRef(null);
  const imageRef = useRef(null);
  const [imageDataUrl, updateImage] = useState(null);
  const [cropperStyles, updateCropperStyles] = useState({
    width: 100,
    height: 100,
  });
  const onCrop = () => {
    const imageElement = cropperRef.current;
    const { cropper } = imageElement;
    updateImage(cropper.getCroppedCanvas().toDataURL());
  };

  const hiddenImageOnLoad = () => {
    const { height, width } = cropperRef.current;
    updateCropperStyles({
      width,
      height,
    });
  };

  const handleOnSave = () => {
    if (imageDataUrl) onSaveImage(imageDataUrl);
    onClose();
  };

  return (
    <Modal
      header="Crop Image"
      onClose={onClose}
      modalWidth="100%"
      isOpen={isOpen}
    >
      <div className="d-flex flex-column">
        <img
          src={`data:${imageType};base64,${imageBase64}`}
          ref={imageRef}
          alt="placeholder"
          hidden="true"
          onLoad={hiddenImageOnLoad}
        />
        <Cropper
          src={`data:${imageType};base64,${imageBase64}`}
          style={{ height: '100%', maxHeight: 600 }}
          // Cropper.js options
          initialAspectRatio={16 / 9}
          guides={false}
          crop={onCrop}
          ref={cropperRef}
          aspectRatio={2 / 1}
          viewMode={2}
        />
        <div className="d-flex flex-justify-end my-2">
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button className="mx-2" onClick={handleOnSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

CropModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageBase64: PropTypes.string.isRequired,
  imageType: PropTypes.string.isRequired,
  onSaveImage: PropTypes.func.isRequired,
};

function CEEventModal(props) {
  const {
    id,
    onClose,
    onUpdateEvent,
    title,
    startDate,
    address,
    type,
    endDate,
    description,
    coverImage,
    isOpen,
    eventSpec,
    refetchEvent,
  } = props;

  const [showCropModal, updateShowCropModal] = useState(false);
  const ref = React.createRef();
  const [imageSrc, updateImageSrc] = useState(null);
  const [imageType, updateImageType] = useState(null);
  const isEventSelected = !!eventSpec;
  const now = DateTime.now();

  const [form, setFormData] = useState({
    id,
    title,
    startDate: startDate ? DateTime.fromISO(startDate) : now,
    endDate: endDate ? DateTime.fromISO(endDate) : now,
    address,
    type: type || 'Music',
    description,
    cover_image: coverImage || null,
  });
  const [coverImageSrc, setCoverImage] = useState(coverImage);

  const isSaveDisabled = useMemo(() => {
    const { startDate: formStartDate, endDate: formEndDate } = form;
    return formStartDate.diff(formEndDate).milliseconds >= 0 || !form.title;
  }, [form.startDate, form.endDate, form.title]);

  const handleValueChange = (key, value) => {
    if (key === 'startDate' || key === 'endDate') {
      setFormData({ ...form, [key]: DateTime.fromJSDate(new Date(value)) });
    } else {
      setFormData({ ...form, [key]: value });
    }
  };

  const handleSave = () => {
    const {
      title: formTitle,
      startDate: formStartDate,
      endDate: formEndDate,
    } = form;
    if (formTitle && formStartDate && formEndDate) {
      form.startDate = formStartDate.toISO();
      form.endDate = formEndDate.toISO();
      onUpdateEvent(form);
      onClose();
    }
  };

  // Get file and grab it's base64 value and image type
  const uploadFileToServer = event => {
    const file = event.target.files[0];
    const { type } = file;
    updateImageType(type);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    handleValueChange('cover_image', event.target.value);

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

  const onUpdateEventImage = imageDataUri => {
    setCoverImage(imageDataUri);
    updateEventCover(imageDataUri, id);
    refetchEvent();
  };

  const modalHeader = id ? 'Edit event' : 'Create event';

  return (
    <Modal
      header={modalHeader}
      modalWidth="80%"
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className="">
        <div className="d-flex p-2 py-4 mt-2 flex-wrap">
          <div className="d-flex flex-column mb-3">
            <H4>Event Name</H4>
            <Input
              defaultValue={title}
              onChange={e => handleValueChange('title', e.target.value)}
              placeholder="Event Name"
            />

            <div className="d-flex py-2">
              <div className="d-flex flex-column">
                <H4>Start Date</H4>
                <DatePicker
                  selected={form.startDate.toJSDate()}
                  showTimeSelect
                  timeIntervals={5}
                  timeFormat="hh:mm aa"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  onChange={date => handleValueChange('startDate', date)}
                />
              </div>
              <div className="d-flex flex-column">
                <H4>End Date</H4>
                <DatePicker
                  selected={form.endDate.toJSDate()}
                  showTimeSelect
                  timeIntervals={5}
                  timeFormat="hh:mm aa"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  onChange={date => handleValueChange('endDate', date)}
                />
              </div>
            </div>

            <div className="d-flex py-2">
              <div className="d-flex flex-column">
                <LocationSelect
                  onChange={e => handleValueChange('address', e)}
                  placeholder="Enter Location"
                  defaultValue={address}
                />
              </div>
              <div className="d-flex ml-2 flex-column">
                <H4>Event Type</H4>
                <select
                  defaultValue={type}
                  onChange={e => handleValueChange('type', e.target.value)}
                >
                  {Object.keys(EventTypes).map(key => (
                    <option value={key} label={EventTypes[key]} />
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex flex-column">
              <H4>Description</H4>
              <textarea
                className="p-1"
                type="text"
                defaultValue={description}
                onChange={e => handleValueChange('description', e.target.value)}
                placeholder="Enter Event Description (Markdown supported)"
              />
            </div>
          </div>

          <div className="d-flex flex-column">
            <H4 className="ml-3">Cover Image</H4>
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
        </div>

        <CropModal
          imageType={imageType}
          isOpen={showCropModal}
          onClose={() => updateShowCropModal(false)}
          imageBase64={`${imageSrc}`}
          onSaveImage={onUpdateEventImage}
        />

        <div className="d-flex py-4 flex-justify-end">
          <Button className="mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button
            inverted={isSaveDisabled}
            disabled={isSaveDisabled}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

CEEventModal.propTypes = {
  onClose: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  refetchEvent: PropTypes.func.isRequired,
};

export default memo(CEEventModal);
