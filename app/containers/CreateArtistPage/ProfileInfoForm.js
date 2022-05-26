'use es6';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-form';
import H2 from 'components/H2';
import FormControl from 'components/Form/FormControl';
import InputField from 'components/Form/InputField';
import TextField from 'components/Form/TextField';
import ImageUploadField from 'components/Form/ImageUploadField';
import Label from 'components/Form/Label';
import Button from 'components/Button';
import MultiSelectField from 'components/Form/MultiSelectField';
import { Genres } from 'containers/CreateHostPage/constants';
import { FormattedMessage } from 'react-intl';
import Uploader from 'components/Uploader';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import PERFORMANCE_TYPES from 'constants/PerformanceTypes';
import messages from './messages';

const GENRE_OPTIONS = Object.keys(Genres).map(key => ({
  label: Genres[key],
  value: key,
}));

const PERFORMANCE_OPTIONS = Object.keys(PERFORMANCE_TYPES).map(key => ({
  label: PERFORMANCE_TYPES[key],
  value: key,
}));

const SOCIAL_MEDIA_DOMAINS = Object.freeze({
  twitter: 'twitter',
  instagram: 'instagram',
  spotify: 'spotify',
  youtube: 'youtube',
});

function ProfileInfoForm({ isEditingProfile, onFormSubmit, profileData }) {
  const defaultValues = useMemo(
    () => ({
      performanceTypes: ['MUSIC'],
      images: [],
      ...profileData,
      socialLinks: (profileData ? profileData.socialLinks : []).reduce(
        (acc, socialMediaLink) => {
          let domain = new URL(socialMediaLink);
          domain = domain.hostname.replace('www.', '');
          domain = domain.replace('.com', '');
          if (SOCIAL_MEDIA_DOMAINS[domain]) {
            acc[domain] = socialMediaLink;
            return acc;
          }
          return acc;
        },
        {},
      ),
    }),
    [],
  );

  const handleSubmit = values => {
    onFormSubmit({
      ...values,
      socialLinks: Object.values(values.socialLinks),
    });
  };

  const { Form, setFieldValue } = useForm({
    defaultValues,
    onSubmit: async values => handleSubmit(values),
    debugForm: false,
  });

  const onFileUploadUpdate = fileList => {
    setFieldValue('images', fileList);
  };

  const onChangeLocation = newAddy => {
    setFieldValue('hometown', newAddy);
  };

  const existingVenuePhotos = (profileData && profileData.images) || [];

  return (
    <Form>
      <div
        className="d-flex flex-justify-center"
        style={{ backgroundColor: '#fafafa' }}
      >
        <FormControl>
          <div>
            <div className="d-flex flex-justify-between flex-wrap">
              <div>
                <H2>
                  {isEditingProfile && (
                    <FormattedMessage {...messages.headerEdit} />
                  )}

                  {!isEditingProfile && (
                    <FormattedMessage {...messages.headerCreate} />
                  )}
                </H2>
                <div className="d-flex flex-column my-2">
                  <Label>
                    <FormattedMessage {...messages.artistName} />
                  </Label>
                  <InputField
                    required
                    name="name"
                    style={{ maxWidth: 300 }}
                    placeholder="Artist name"
                  />
                </div>

                <div className="d-flex flex-column my-2">
                  <Label>
                    <FormattedMessage {...messages.address} />{' '}
                  </Label>
                  <LocationSelect onChange={onChangeLocation} />
                </div>
              </div>
              <div className="d-flex flex-column flex-items-center my-2">
                <Label>
                  <FormattedMessage {...messages.uploadAvatar} />{' '}
                </Label>
                <ImageUploadField name="avatar" required />
              </div>
            </div>

            <div className="d-flex flex-column my-2">
              <Label>
                <FormattedMessage {...messages.artToPerform} />{' '}
              </Label>
              <MultiSelectField
                isMulti
                name="performanceTypes"
                options={PERFORMANCE_OPTIONS}
              />
            </div>

            <div className="d-flex flex-column my-2">
              <Label>
                <FormattedMessage {...messages.genreDoYouPlay} />
              </Label>
              <MultiSelectField isMulti name="genres" options={GENRE_OPTIONS} />
            </div>

            <div className="d-flex flex-column my-2">
              <Label>
                <FormattedMessage {...messages.artistBio} />{' '}
              </Label>
              <TextField required name="description" className="my-1" />
            </div>

            <div className="d-flex flex-column my-2">
              <Label>
                <FormattedMessage {...messages.socialMediaLinks} />
              </Label>
              <span>
                <InstagramIcon className="mr-2" />
                <InputField
                  className="my-1 full-width"
                  name="socialLinks.instagram"
                  style={{ maxWidth: 500 }}
                  placeholder="www.instagram.com/your-profile"
                />
              </span>
              <span>
                <svg
                  className="mr-2"
                  style={{ width: 24 }}
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="M507,257.1c0,2.5-0.1,5,0,7.5c1.2,43.2-11.5,82.9-33.5,119.3c-40.5,67-99.8,108.7-177.4,119.5   c-99,13.8-179.6-21-240.1-100.7C29.8,368.3,14.8,328.8,10.4,286c-8.3-82.4,17-153.1,76.8-210.6c41.6-40,91.8-62.9,149.2-67.1   c91.8-6.7,166.4,27.1,222.7,100c26,33.7,41.4,72.3,46.7,114.6c1.4,11.3,0.2,22.8,0.2,34.3C506.3,257.1,506.7,257.1,507,257.1z    M207.8,139.3c-9.5,0.7-24.6,1.4-39.7,3c-22.4,2.2-44.5,6.1-66,12.9c-12.5,4-19,16.8-15.2,29.1c3.8,12.2,16.5,19.1,29,15.4   c30.1-8.9,60.9-12.6,92.1-13.6c30.2-1,60.2,0.9,90,5.9c37.6,6.3,74,16.7,107.3,36c12.2,7.1,26.2,3.8,33-7.8   c6.8-11.5,2.9-25.7-9.7-32.5c-11.7-6.3-23.6-12.5-35.8-17.5C335.4,146.7,275.1,139,207.8,139.3z M209.5,225   c-9.1,0.7-25.5,1.2-41.6,3.6c-16.9,2.5-33.6,6.4-50.3,10.6c-12.5,3.1-18.3,16.1-13.1,27.1c4.5,9.3,13.7,13.1,24.8,9.9   c40.5-11.8,81.9-14.4,123.6-9.9c44,4.7,85.8,16.6,124.1,39.6c9.5,5.7,21.1,2.5,26.6-6.6c5.6-9.3,2.6-21.1-7.1-26.9   c-6.7-4-13.5-7.9-20.5-11.3C325.9,236.2,272.4,225.8,209.5,225z M375.2,359.2c0.1-6.3-2.8-11.1-8.2-13.8   c-15.7-7.7-31.1-16.1-47.4-22.2c-34.4-13-70.3-17-107-16.3c-28.8,0.6-57.1,4.6-85.1,10.7c-10.1,2.2-15.9,9.9-14,18.4   c2.2,9.8,9.8,14.3,20.5,11.9c35.3-7.7,70.9-11.9,107.1-9.4c25.6,1.8,50.6,6.4,74.3,16.2c12.3,5.1,24,11.4,35.8,17.5   C362.8,378.3,375.2,371.7,375.2,359.2z" />
                  </g>
                </svg>
                <InputField
                  className="my-1 full-width"
                  name="socialLinks.spotify"
                  style={{ maxWidth: 500 }}
                  placeholder="www.spotify.com/your-artist-profile"
                />
              </span>
              <span>
                <YouTubeIcon className="mr-2" />

                <InputField
                  className="my-1 full-width"
                  name="socialLinks.youtube"
                  style={{ maxWidth: 500 }}
                  placeholder="www.youtube.com/your-channel"
                />
              </span>

              <span>
                <TwitterIcon className="mr-2" />

                <InputField
                  className="my-1 full-width"
                  name="socialLinks.twitter"
                  style={{ maxWidth: 500 }}
                  placeholder="www.twitter.com/your-profile"
                />
              </span>
            </div>

            <div>
              <Label> Upload promo content </Label>
              <Uploader
                fileUrls={existingVenuePhotos}
                onUpdate={onFileUploadUpdate}
              />
            </div>
          </div>
          <div className="d-flex full-width flex-justify-end">
            <div className="d-flex">
              <Button className="p-4 work-sans-black" type="submit">
                {!isEditingProfile && (
                  <FormattedMessage {...messages.createProfile} />
                )}
                {isEditingProfile && (
                  <FormattedMessage {...messages.editProfile} />
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
  profileData: PropTypes.object.isRequired,
  isEditingProfile: PropTypes.object.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

export default ProfileInfoForm;
