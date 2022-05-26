/**
 *
 * CreateArtistPage
 *
 */

import React, { memo, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { useInjectReducer } from 'utils/injectReducer';
import Routes from 'data/Routes';
import { graphql, useMutation, useLazyLoadQuery } from 'react-relay';
import { trackEvent } from 'utils/analytics';
import makeSelectCreateArtistPage from './selectors';
import reducer from './reducer';
import FormContainer from './FormContainer';
import { PAGE_STEPS } from './constants';
import ConfirmationCard from '../../components/ConfirmationCard';

const Wrapper = styled.div`
  background-color: #fafafa;
  padding-bottom: 12px;
`;

const ArtistQuery = graphql`
  query CreateArtistPageQuery($id: ID!) {
    artist(id: $id) {
      id
      socialLinks
      featuredMedia
      spotifyProfile
      youtubeProfile
      twitterProfile
      soundcloudProfile
      instagramProfile
      hometown {
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
      images
      avatar
      genres
      name
      description
      isVerified
      performanceTypes
      isCurator
      isBand
    }
  }
`;

const EditArtistMutation = graphql`
  mutation CreateArtistPageEditMutation(
    $id: ID!
    $performanceTypes: [String]
    $genres: [String]
    $socialLinks: [String]
    $name: String!
    $hometown: AddressInputField
    $description: String!
    $avatar: String
    $images: [String]!
    $spotifyProfile: String
    $soundcloudProfile: String
    $instagramProfile: String
    $youtubeProfile: String
    $twitterProfile: String
    $featuredMedia: [String]
    $isBand: Boolean
  ) {
    editArtistProfile(
      id: $id
      genres: $genres
      performanceTypes: $performanceTypes
      socialLinks: $socialLinks
      spotifyProfile: $spotifyProfile
      soundcloudProfile: $soundcloudProfile
      instagramProfile: $instagramProfile
      youtubeProfile: $youtubeProfile
      twitterProfile: $twitterProfile
      hometown: $hometown
      name: $name
      description: $description
      avatar: $avatar
      images: $images
      featuredMedia: $featuredMedia
      isBand: $isBand
    ) {
      success
      msg
    }
  }
`;

const CreateArtistMutation = graphql`
  mutation CreateArtistPageMutation(
    $performanceTypes: [String]
    $genres: [String]
    $socialLinks: [String]
    $name: String
    $hometown: AddressInputField
    $description: String
    $avatar: String
    $images: [String]!
    $spotifyProfile: String
    $soundcloudProfile: String
    $instagramProfile: String
    $youtubeProfile: String
    $twitterProfile: String
    $featuredMedia: [String]
    $isBand: Boolean
  ) {
    createArtistProfile(
      genres: $genres
      performanceTypes: $performanceTypes
      socialLinks: $socialLinks
      hometown: $hometown
      name: $name
      description: $description
      spotifyProfile: $spotifyProfile
      soundcloudProfile: $soundcloudProfile
      instagramProfile: $instagramProfile
      youtubeProfile: $youtubeProfile
      twitterProfile: $twitterProfile
      featuredMedia: $featuredMedia
      avatar: $avatar
      images: $images
      isBand: $isBand
    ) {
      success
    }
  }
`;

export function CreateArtistPage({ match }) {
  useInjectReducer({ key: 'createArtistPage', reducer });
  const {
    params: { artistId },
  } = match;
  const data = useLazyLoadQuery(ArtistQuery, {
    id: artistId || 'doesntExist',
  });

  const [commitEditArtist, editMutationPending] = useMutation(
    EditArtistMutation,
  );
  const [commitCreateArtist, createMutationPending] = useMutation(
    CreateArtistMutation,
  );
  const [currentPage, onPageChange] = useState(PAGE_STEPS.BASIC_INFO);

  const isEditingProfile = useMemo(() => {
    const {
      params: { artistId },
    } = match;
    return !!artistId;
  });

  const [confirmed, setConfirmation] = useState(false);
  const showConfirmedCard = () => {
    setConfirmation(!confirmed);
  };

  const onSubmit = useCallback(values => {
    if (isEditingProfile) {
      const {
        params: { artistId: artistGlobalId },
      } = match;
      commitEditArtist({
        variables: {
          id: artistGlobalId,
          ...values,
          images: values.images.map(file =>
            typeof file === 'string' ? file : file.url,
          ),
        },
        onCompleted: response => {
          trackEvent('edit_artist_profile', {
            ...values,
          });
          if (
            response &&
            response.editArtistProfile &&
            response.editArtistProfile.success
          ) {
            showConfirmedCard();
            trackEvent('create_artist_profile', {
              ...values,
            });
          }
        },
      });
    } else {
      commitCreateArtist({
        variables: {
          ...values,
          images: values.images.map(file =>
            typeof file === 'string' ? file : file.url,
          ),
        },
        onCompleted: response => {
          if (
            response &&
            response.createArtistProfile &&
            response.createArtistProfile.success
          ) {
            showConfirmedCard();
            trackEvent('create_artist_profile', {
              ...values,
            });
          }
        },
      });
    }
  });

  if (isEditingProfile && !data.artist) return null;

  return (
    <Wrapper>
      <Helmet>
        <title>Artist Profile | Cadenzo</title>
        <meta name="description" content="Cadenzo artist profile page" />
      </Helmet>
      {confirmed && (
        <ConfirmationCard
          onClose={showConfirmedCard}
          isOpen={confirmed}
          header="Congrats, your profile has been created!"
          subtext="Time to start booking"
          enableExit={false}
        >
          <a href={Routes.calendar()}>
            <button type="button">Set Availability</button>
          </a>
          <a href={Routes.discoverVenues()}>
            <button type="button">Discover Venues</button>
          </a>
        </ConfirmationCard>
      )}
      <FormContainer
        onPageChange={onPageChange}
        activePage={currentPage}
        onSubmit={onSubmit}
        defaultFormValues={data.artist || {}}
        isEditingProfile={isEditingProfile}
      />
    </Wrapper>
  );
}

CreateArtistPage.propTypes = {
  match: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  createArtistPage: makeSelectCreateArtistPage(),
});

const mapDispatchToProps = {
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(withRouter(CreateArtistPage));
