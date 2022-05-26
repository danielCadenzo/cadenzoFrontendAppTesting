/**
 *
 * UiAvatar
 *
 */

import React, { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-form';
import Label from 'components/Form/Label';
import InputField from 'components/Form/InputField';
import LocationField from 'components/Form/LocationField';
import Modal from 'components/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import { graphql, useMutation } from 'react-relay';
import messages from './messages';

const SEND_REQUEST = graphql`
  mutation ProfileRequestModalMutation(
    $contactName: String!
    $businessName: String
    $contactPhone: String
    $contactSocialMedia: String
    $location: AddressInputField
    $profileName: String
  ) {
    sendProfileRequest(
      contactName: $contactName
      businessName: $businessName
      contactPhone: $contactPhone
      contactSocialMedia: $contactSocialMedia
      location: $location
      profileName: $profileName
    ) {
      success
    }
  }
`;

const artistIl8nKeys = Object.freeze({
  profileName: 'artistProfileName',
  contactName: 'artistContactName',
  contactPhone: 'artistContactPhone',
  contactSocialMedia: 'artistContactSocialMedia',
});

const venueIl8nKeys = Object.freeze({
  profileName: 'venueProfileName',
  contactName: 'venueContactName',
  contactPhone: 'venueContactPhone',
  contactSocialMedia: 'venueContactSocialMedia',
});

function ProfileRequestModal({ searchType, venueIsSearchType }) {
  const [showModal, setShowModal] = useState(false);
  const [sendProfileRequest, isInFlight] = useMutation(SEND_REQUEST);

  const defaultValues = useMemo(
    () => ({
      itemType: searchType,
      location: null,
      profileName: null,
      contactName: null,
      contactPhone: null,
      contactSocialMedia: null,
      businessName: null,
    }),
    [searchType],
  );
  const il8nMap = useMemo(
    () => (venueIsSearchType ? venueIl8nKeys : artistIl8nKeys),
    [searchType],
  );
  const { Form, values, reset } = useForm({
    defaultValues,
  });

  const toggleModal = () => setShowModal(!showModal);
  const notFoundi18nKey = venueIsSearchType
    ? 'VenueNotFound'
    : 'ArtistNotFound';

  const onSubmit = () => {
    sendProfileRequest({
      variables: values,
      onCompleted: response => {
        if (
          response &&
          response.sendProfileRequest &&
          response.sendProfileRequest.success
        ) {
          toggleModal();
          reset();
        }
      },
    });
  };

  return (
    <div>
      <button
        className="cursor-pointer full-width d-flex flex-justify-center"
        type="button"
        aria-label="Don't see the item you're looking for?"
        onClick={toggleModal}
      >
        <p className="py-1 my-2" style={{color: '#826FC8'}}>
          <FormattedMessage {...messages[notFoundi18nKey]} />
        </p>
      </button>
      <Modal
        header="Request to add a profile to book"
        modalWidth="800px"
        isOpen={showModal}
        onClose={toggleModal}
      >
        <Form className="d-flex flex-column py-3">
          {venueIsSearchType && (
            <>
              <Label>
                <FormattedMessage {...messages.venueProfileName} />{' '}
              </Label>
              <InputField
                type="text"
                placeholder="The Jimmmy Bobby"
                name="businessName"
              />
            </>
          )}

          <Label>
            {' '}
            <FormattedMessage {...messages[il8nMap.contactName]} />{' '}
          </Label>
          <InputField type="text" placeholder="Jim Bob" name="contactName" />

          <Label>
            {' '}
            <FormattedMessage {...messages[il8nMap.contactPhone]} />{' '}
          </Label>
          <InputField
            type="tel"
            name="contactPhone"
            placeholder="555-306-7939"
          />

          <Label>
            {' '}
            <FormattedMessage {...messages[il8nMap.contactSocialMedia]} />{' '}
          </Label>
          <InputField
            type="url"
            placeholder="www.instagram.com, spotify.com, etc"
            name="contactSocialMedia"
          />

          <Label>
            {' '}
            <FormattedMessage {...messages.profileRequestLocation} />{' '}
          </Label>
          <LocationField showCitiesAndPlaces useRawAddress name="location" />
        </Form>

        <div className="d-flex full-width flex-justify-center">
          <Button onClick={onSubmit}>
            {' '}
            <p className="f3">Submit</p>{' '}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

ProfileRequestModal.propTypes = {
  searchType: PropTypes.string.isRequired,
  venueIsSearchType: PropTypes.bool.isRequired,
};

export default memo(ProfileRequestModal);
