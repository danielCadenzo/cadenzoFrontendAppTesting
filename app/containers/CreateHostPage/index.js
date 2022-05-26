/**
 *
 * CreateArtistPage
 *
 */

import React, { memo, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import Routes from 'data/Routes';
import { graphql, useMutation, useLazyLoadQuery } from 'react-relay';
import { trackEvent } from 'utils/analytics';
import { PAGE_STEPS } from './constants';
import FormContainer from './FormContainer';
import reducer from './reducer';
import * as HostActions from './actions';
import ConfirmationCard from '../../components/ConfirmationCard';

const VenueQuery = graphql`
  query CreateHostPageQuery($id: ID) {
    venue(id: $id) {
      images
      avatar
      name
      dailyBookingFee
      hourlyBookingFee
      description
      spaceType
      isVerified
      socialLinks
      anemities
      capacity
      instagramProfile
      facebookProfile
      exactCapacity
      preferredPerformances
      address {
        latitude
        longitude
        raw
        route
        formatted
        streetNumber
        locality {
          postalCode
          state {
            name
            code
            country {
              code
              name
            }
          }
          name
        }
      }
    }
  }
`;

const CreateVenueProfile = graphql`
  mutation CreateHostPageMutation(
    $preferredPerformances: [String]
    $exactCapacity: Int
    $capacity: String!
    $spaceType: String!
    $socialLinks: [String]
    $images: [String]
    $name: String!
    $facebookProfile: String
    $instagramProfile: String
    $address: AddressInputField
    $description: String!
    $avatar: String
  ) {
    createVenueProfile(
      capacity: $capacity
      exactCapacity: $exactCapacity
      preferredPerformances: $preferredPerformances
      socialLinks: $socialLinks
      spaceType: $spaceType
      address: $address
      name: $name
      description: $description
      avatar: $avatar
      images: $images
      instagramProfile: $instagramProfile
      facebookProfile: $facebookProfile
    ) {
      success
    }
  }
`;

const EditVenueProfile = graphql`
  mutation CreateHostPageEditMutation(
    $id: ID!
    $preferredPerformances: [String]
    $exactCapacity: Int
    $capacity: String!
    $spaceType: String!
    $anemities: [String]
    $socialLinks: [String]
    $name: String!
    $facebookProfile: String
    $instagramProfile: String
    $address: AddressInputField
    $description: String!
    $avatar: String
    $images: [String]
  ) {
    editVenueProfile(
      id: $id
      capacity: $capacity
      exactCapacity: $exactCapacity
      preferredPerformances: $preferredPerformances
      socialLinks: $socialLinks
      spaceType: $spaceType
      anemities: $anemities
      instagramProfile: $instagramProfile
      facebookProfile: $facebookProfile
      address: $address
      name: $name
      description: $description
      avatar: $avatar
      images: $images
    ) {
      success
    }
  }
`;

export function CreateHostPage({ match }) {
  useInjectReducer({ key: 'createHostPage', reducer });
  const [currentPage, onPageChange] = useState(PAGE_STEPS.BASIC_INFO);

  const isEditingHostProfile = useMemo(() => {
    const {
      params: { hostId },
    } = match;
    return !!hostId;
  }, []);

  const [commitEditVenue, editMutationPending] = useMutation(EditVenueProfile);
  const [commitCreateVenue, createMutationPending] = useMutation(
    CreateVenueProfile,
  );

  const [confirmed, setConfirmation] = useState(false);
  const showConfirmedCard = () => {
    setConfirmation(!confirmed);
  };

  const data = useLazyLoadQuery(VenueQuery, {
    id: isEditingHostProfile ? match.params.hostId : 'doesntexist',
  });

  const onSubmit = useCallback(values => {
    const {
      params: { hostId },
    } = match;

    const params = isEditingHostProfile
      ? {
        id: hostId,
        ...values,
        images: values.images.map(file =>
          typeof file === 'string' ? file : file.url,
        ),
      }
      : values;

    const apiCall = isEditingHostProfile ? commitEditVenue : commitCreateVenue;
    const propertyKey = isEditingHostProfile
      ? 'editVenueProfile'
      : 'createVenueProfile';

    apiCall({
      variables: params,
      onCompleted: response => {
        if (
          response &&
          response[propertyKey] &&
          response[propertyKey].success
        ) {
          const eventName = isEditingHostProfile
            ? 'edit_venue_profile'
            : 'create_venue_profile';
          trackEvent(eventName, {
            ...values,
          });
          showConfirmedCard();
        }
      },
    });
  });

  if (!data.venue && isEditingHostProfile) return null;
  if (data.venue === null && isEditingHostProfile)
    throw new Error('Venue does not exist');

  return (
    <div className="pb-4 bg-default">
      <Helmet>
        <title>Venue Profile | Cadenzo</title>
        <meta
          name="description"
          content="manage your own venue and host events on Cadenzo"
        />
      </Helmet>
      {confirmed && (
        <ConfirmationCard
          onClose={showConfirmedCard}
          isOpen={confirmed}
          header="Congrats, your profile has been created!"
          subtext="Time to start booking shows"
          enableExit={false}
        >
          <a href={Routes.calendar()}>
            <button type="button">Set Availability</button>
          </a>
          <a href={Routes.discoverArtists()}>
            <button type="button">Discover Artist</button>
          </a>
        </ConfirmationCard>
      )}
      <FormContainer
        isEditingHostProfile={isEditingHostProfile}
        onSubmit={onSubmit}
        onPageChange={onPageChange}
        defaultFormValues={data.venue || {}}
        activePage={currentPage}
      />
    </div>
  );
}

CreateHostPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {
  editVenueProfile: HostActions.editVenueProfile,
  createVenueProfile: HostActions.createVenueProfile,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(withRouter(CreateHostPage));
