import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import InputField from 'components/Form/InputField';
import UIIcon from 'components/UIIcon';
import Button from 'components/Button';
import Label from 'components/Form/Label';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import { FormattedMessage } from 'react-intl';
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
  max-width: 400px;
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

const DesktopContainer = styled.div`
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const MobileContainer = styled.div`
  @media screen and (min-width: 600px) {
    display: none;
  }
`;
function BasicInformation({ setFieldValue, onPageChange, values }) {
  const onChangeLocation = newAddy => {
    setFieldValue('hometown', newAddy);
  };

  const onNext = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    onPageChange(PAGE_STEPS.DETAILED_INFO);
  }, []);

  const defaultLocationInputValue = useMemo(() => {
    if (values.hometown) {
      if (values.hometown.formatted) return values.hometown.formatted;
      if (values.hometown.raw) return values.hometown.raw;
    }
  }, []);

  return (
    <div>
      <DesktopContainer>
        <Header className="full-width">
        <Headline>The Basics</Headline>
        <TextContainer>
          Let’s start with the basics like, what is your name, stagename and
          contact info!
        </TextContainer>
      </Header>
      <div className="full-width d-flex flex-justify-center">
        <FormContainer>
          <div className="d-flex flex-column">
            <div className="d-flex flex-column">
              <Label>
                <FormattedMessage {...messages.artistName} />
              </Label>
              <InputField name="name" />
            </div>

            <div className="d-flex flex-column my-2">
              <Label>
                <FormattedMessage {...messages.address} />{' '}
              </Label>
              <LocationSelect
                showCitiesAndPlaces
                defaultValue={defaultLocationInputValue}
                onChange={onChangeLocation}
              />
            </div>
          </div>

          <div className="d-flex flex-column">
            <Label> Social Media Profiles </Label>
            <span>
              {/* <InstagramIcon className="mr-2" /> */}
              <UIIcon name="Instagram" />
              <InputField
                className="my-1 full-width"
                name="instagramProfile"
                style={{ maxWidth: 500 }}
                placeholder="www.instagram.com/your-profile"
              />
            </span>

            <span>
              {/* <svg className="mr-2" style={{ width: 24 }} viewBox="0 0 512 512">
                <g>
                  <path d="M507,257.1c0,2.5-0.1,5,0,7.5c1.2,43.2-11.5,82.9-33.5,119.3c-40.5,67-99.8,108.7-177.4,119.5   c-99,13.8-179.6-21-240.1-100.7C29.8,368.3,14.8,328.8,10.4,286c-8.3-82.4,17-153.1,76.8-210.6c41.6-40,91.8-62.9,149.2-67.1   c91.8-6.7,166.4,27.1,222.7,100c26,33.7,41.4,72.3,46.7,114.6c1.4,11.3,0.2,22.8,0.2,34.3C506.3,257.1,506.7,257.1,507,257.1z    M207.8,139.3c-9.5,0.7-24.6,1.4-39.7,3c-22.4,2.2-44.5,6.1-66,12.9c-12.5,4-19,16.8-15.2,29.1c3.8,12.2,16.5,19.1,29,15.4   c30.1-8.9,60.9-12.6,92.1-13.6c30.2-1,60.2,0.9,90,5.9c37.6,6.3,74,16.7,107.3,36c12.2,7.1,26.2,3.8,33-7.8   c6.8-11.5,2.9-25.7-9.7-32.5c-11.7-6.3-23.6-12.5-35.8-17.5C335.4,146.7,275.1,139,207.8,139.3z M209.5,225   c-9.1,0.7-25.5,1.2-41.6,3.6c-16.9,2.5-33.6,6.4-50.3,10.6c-12.5,3.1-18.3,16.1-13.1,27.1c4.5,9.3,13.7,13.1,24.8,9.9   c40.5-11.8,81.9-14.4,123.6-9.9c44,4.7,85.8,16.6,124.1,39.6c9.5,5.7,21.1,2.5,26.6-6.6c5.6-9.3,2.6-21.1-7.1-26.9   c-6.7-4-13.5-7.9-20.5-11.3C325.9,236.2,272.4,225.8,209.5,225z M375.2,359.2c0.1-6.3-2.8-11.1-8.2-13.8   c-15.7-7.7-31.1-16.1-47.4-22.2c-34.4-13-70.3-17-107-16.3c-28.8,0.6-57.1,4.6-85.1,10.7c-10.1,2.2-15.9,9.9-14,18.4   c2.2,9.8,9.8,14.3,20.5,11.9c35.3-7.7,70.9-11.9,107.1-9.4c25.6,1.8,50.6,6.4,74.3,16.2c12.3,5.1,24,11.4,35.8,17.5   C362.8,378.3,375.2,371.7,375.2,359.2z" />
                </g>
              </svg> */}
              <UIIcon name="Spotify" />
              <InputField
                className="my-1 full-width ml-1"
                name="spotifyProfile"
                style={{ maxWidth: 500 }}
                placeholder="www.spotify.com/your-artist-profile"
              />
            </span>

            <span>
              {/* <SoundcloudIcon
                className="mr-1"
                fill="black"
                width={28}
                height={28}
              /> */}
              <UIIcon name="Soundcloud" />

              <InputField
                className="my-1 full-width ml-1"
                name="soundcloudProfile"
                style={{ maxWidth: 500 }}
                placeholder="www.soundcloud.com/your-channel"
              />
            </span>

            <span>
              {/* <YouTubeIcon className="mr-2" /> */}
              <UIIcon name="Youtube" />

              <InputField
                className="my-1 full-width"
                name="youtubeProfile"
                style={{ maxWidth: 500 }}
                placeholder="www.youtube.com/your-channel"
              />
            </span>

            <span>
              {/* <TwitterIcon className="mr-2" /> */}
              <UIIcon name="Twitter" />

              <InputField
                className="my-1 full-width"
                name="twitterProfile"
                style={{ maxWidth: 500 }}
                placeholder="www.twitter.com/your-profile"
              />
            </span>
          </div>
          <div className="d-flex flex-column">
            <Label> Featured Media </Label>
            <InputField
              className="my-1 full-width"
              name="featuredMedia"
              placeholder="Have a song/video you want to feature? Place it here!"
            />
          </div>
          <div className="d-flex flex-row-reverse">
            <Button role="button" onClick={onNext}>
              Next
            </Button>
          </div>
        </FormContainer>
      </div>
      </DesktopContainer>
      <MobileContainer>
        <img width="100%" height={900} src='https://s3.us-west-2.amazonaws.com/secure.notion-static.com/45a741a1-e6a0-4080-ac28-011ff65bab7b/Blocker.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220520T174903Z&X-Amz-Expires=86400&X-Amz-Signature=2abc2dd93c655ac5786757d96829bb0011e5fef2b73d36e93bb6d4a4cbbbad97&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Blocker.png%22&x-id=GetObject' alt="under construction"/>
      </MobileContainer>
    </div>
  );
}

BasicInformation.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
};

export default BasicInformation;
