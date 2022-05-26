import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'components/Button';
import Label from 'components/Form/Label';
import { FormattedMessage } from 'react-intl';
import Uploader from 'components/Uploader';
import ImageUploadField from 'components/Form/ImageUploadField';
import messages from './messages';
import { PAGE_STEPS } from './constants';

const Header = styled.div`
  background-color: black;
  background: linear-gradient(93.34deg, #5926cc 0%, #a84bf5 100%);
  width: 100%;
  /* height: 200px; */
  margin-bottom: -60px;
  /* box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.4); */
  background-size: auto;
  background-position: center;
  color: white !important;
  padding: 80px 20px 120px 20px !important;
`;

const Headline = styled.h2`
  font-style: normal;
  font-weight: bold;
  font-size: 72px;
  line-height: 84px;
  letter-spacing: -0.02em;
  color: #ffffff;
`;

const FormContainer = styled.div`
  background-color: white;
  color: black;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
`;

const TextContainer = styled.p`
  max-width: min(500px, 100%);
`;

const AdditionalPhotoHeader = styled(Label)`
  font-size: 27px;
  font-weight: 500;
  color: black;
`;
const AdditionalPhotoSubHeader = styled(Label)`
  font-weight: 400;
  margin-bottom: 5px;
`;

const AdditionalPhotosWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function MediaInformation({ values, setFieldValue, onPageChange }) {
  const onFileUploadUpdate = fileList => {
    setFieldValue('images', fileList);
  };

  const onPrevious = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    onPageChange(PAGE_STEPS.DETAILED_INFO);
  }, []);

  const existingVenuePhotos = (values && values.images) || [];
  return (
    <div>
      <Header>
        <Headline>Final Step! Almost Done!</Headline>
        <TextContainer>
          We almost have everything to help you kill your bookings! We just need
          any media that you want to showcase, venues book 5x more often when
          you have pictures of the establishment.
        </TextContainer>
      </Header>

      <div className="d-flex flex-justify-center">
        <FormContainer>
          <div className="d-flex flex-column my-2">
            <div className="d-flex flex-column flex-items-center my-2">
              <AdditionalPhotoHeader>
                <FormattedMessage {...messages.uploadAvatar} />{' '}
              </AdditionalPhotoHeader>
              <ImageUploadField name="avatar" required />
            </div>

            <div>
              <AdditionalPhotosWrapper>
                <AdditionalPhotoHeader>
                  {' '}
                  Upload Additional Photos{' '}
                </AdditionalPhotoHeader>
                <AdditionalPhotoSubHeader>
                  Add pictures showing off your venue (Stage, Amenities, etc.)
                </AdditionalPhotoSubHeader>
              </AdditionalPhotosWrapper>
              <Uploader
                fileUrls={existingVenuePhotos}
                onUpdate={onFileUploadUpdate}
              />
            </div>
          </div>

          <div className="full-width flex-row-reverse d-flex">
            <Button> Submit </Button>
            <Button onClick={onPrevious}> Previous </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}

MediaInformation.propTypes = {
  values: PropTypes.object,
  onPageChange: PropTypes.func,
  setFieldValue: PropTypes.func,
};

export default MediaInformation;
