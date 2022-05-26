import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';
import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';

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

export default CropModal;
