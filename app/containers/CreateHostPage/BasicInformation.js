import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Label from 'components/Form/Label';
import { FormattedMessage } from 'react-intl';
import InputField from 'components/Form/InputField';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import SpaceTypes from 'constants/SpaceTypes';
import SelectField from 'components/Form/SelectField';
import UIIcon from 'components/UIIcon';
import Button from 'components/Button';
import {
  PAGE_STEPS,
  Header,
  Headline,
  FormContainer,
  TextContainer,
} from './constants';
import messages from './messages';

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
    setFieldValue('address', newAddy);
  };

  const onNext = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    onPageChange(PAGE_STEPS.DETAILED_INFO);
  }, []);

  const SPACE_OPTIONS = useMemo(
    () =>
      Object.keys(SpaceTypes).map(optionKey => ({
        label: SpaceTypes[optionKey],
        value: optionKey,
      })),
    [],
  );

  const defaultLocationInputValue = useMemo(() => {
    if (values.address) {
      if (values.address.formatted) return values.address.formatted;
      if (values.address.raw) return values.address.raw;
    }
  }, []);

  return (
    <div>
      <DesktopContainer>
        <Header>
          <Headline>The Basics</Headline>
          <TextContainer>
            Let’s start with the basics like, what is your name, stagename and
            contact info!
          </TextContainer>
        </Header>
        <div className="d-flex flex-column flex-items-center flex-justify-center">
          <FormContainer>
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
              <Label>
                <FormattedMessage {...messages.address} />{' '}
              </Label>
              <LocationSelect
                defaultValue={defaultLocationInputValue}
                onChange={onChangeLocation}
              />
            </div>
            <div className="d-flex flex-column my-2">
              <Label> What category is your space? </Label>
              <div className="d-flex flex-wrap">
                <SelectField name="spaceType" options={SPACE_OPTIONS} />
              </div>
            </div>
            <div>
              <Label> Social Media Profiles </Label>
              <span className="d-flex flex-items-center">
                {/* <InstagramIcon className="mr-2" /> */}
                <UIIcon name="Instagram" />
                <InputField
                  className="my-1 full-width"
                  name="instagramProfile"
                  style={{ maxWidth: 500 }}
                  placeholder="www.instagram.com/your-profile"
                />
              </span>
              <span className="d-flex flex-items-center">
                {/* <FacebookIcon className="mr-2" /> */}
                <UIIcon name="Facebook" />
                <InputField
                  className="my-1 full-width"
                  name="facebookProfile"
                  style={{ maxWidth: 500 }}
                  placeholder="www.facebook.com/your-artist-profile"
                />
              </span>
            </div>
            <div className="d-flex flex-row-reverse">
              <Button role="button" onClick={onNext}>
                <p className="f3">
                  <FormattedMessage {...messages.next} />
                </p>
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

export default BasicInformation;
