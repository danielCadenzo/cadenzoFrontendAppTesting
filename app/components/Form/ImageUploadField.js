import React, { Fragment, useState } from 'react';
import { useField } from 'react-form';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { uploadGenericImage } from 'data/clients/eventClient';
import { IconButton } from '@material-ui/core';
import UIIcon from '../UIIcon';

const Box = styled.div`
  display: flex;
  flex-align-items: center;
  flex-justify-content: center;
  width: 200px;
  height: 200px;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23333' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")
  ${props =>
    (!!props.background &&
      `, url(${
        !props.shouldUseUrl ? `data:image/${props.imageType};base64,` : ''
      }${props.background});`) ||
    ';'}
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
  display: none;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  ${Box}:hover & {
    display: flex !important;
    background-color: 252424c9 !important;
  }
`;

const BoxInitial = styled.div`
  display: block;
  padding-top: 38%;
  ${Box}:hover & {
    display: none;
  }
`;

const FILENAME_PREFIX = 'some-cool-image';
export default function ImageUploadField(props) {
  const { name = 'image', ...rest } = props;
  const { value, setValue } = useField(name);
  const ref = React.createRef();
  const [imageType, updateImageType] = useState(null);
  const [coverImageSrc, setCoverImage] = useState(undefined);

  const onUpdateEventImage = (imageDataUri, imgType) => {
    setCoverImage(imageDataUri);
    uploadGenericImage(imageDataUri, `${FILENAME_PREFIX}.${imgType}`).then(
      data => {
        const { uploadImage } = data;
        if (uploadImage && uploadImage.success) {
          setValue(uploadImage.imageUrl);
        }
      },
    );
  };

  const uploadFileToServer = event => {
    const file = event.target.files[0];
    const { type } = file;
    if (!file) return;
    const imgType = type.replace('image/', '');
    updateImageType(imgType);
    const reader = new FileReader();

    // eslint-disable-next-line func-names
    reader.onload = function() {
      // convert to base64
      const base64Image = btoa(reader.result);
      setCoverImage(base64Image);
      onUpdateEventImage(base64Image, imgType);
    };
    // eslint-disable-next-line func-names
    reader.onerror = function() {
      // eslint-disable-next-line no-console
      console.info('there are some problems');
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Fragment>
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
        background={coverImageSrc || value}
        shouldUseUrl={!!(!coverImageSrc && value)}
        imageType={imageType}
      >
        {!(coverImageSrc || value) && (
          <BoxInitial>
            <UIIcon name="AddPhoto" />
          </BoxInitial>
        )}
        <BoxOverlay>
          <div className="replace-box d-flex flex-self-center flex-column">
            <IconButton className="fit-content-height">
              <UIIcon name="AddPhotoAlternate" />
            </IconButton>
            {coverImageSrc || value ? 'Replace' : 'Add'}
          </div>
        </BoxOverlay>
      </Box>
    </Fragment>
  );
}

ImageUploadField.propTypes = {
  name: PropTypes.string,
};
