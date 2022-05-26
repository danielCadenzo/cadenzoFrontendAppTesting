/**
 *
 * MainContent
 *
 */

import React, { memo, Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';
import { useInjectReducer } from 'utils/injectReducer';
import { withRouter } from 'react-router-dom';
import { graphql, useLazyLoadQuery } from 'react-relay';
import Button from 'components/Button';
import LoadingSpinner from 'components/LoadingSpinner';
import CreatorHeader from 'containers/VenueBookingPage/CreatorHeader';
import { useWindowDimensions } from 'utils/customHooks';
import makeSelectMainContent from './selectors';
import reducer from './reducer';
import BookingCalendar from './BookingCalendar';
import Header from './Header';
import FeaturedContent from './FeaturedContent';
import { deviceSizes } from '../../constants/ResponsiveSizing/deviceSize';
import Iframely from '../../components/IFramely';
import MobileDrawer from '../../components/MobileDrawer';

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  overflow: scroll;
  align-items: center;
  overflow: scroll;
  }
`;

const SectionLabel = styled.h2`
  margin-top: 15px;
  margin-left: 15px;
  margin-bottom: 15px;
  font-weight: bold;
`;

const Description = styled.p`
  margin-left: 15px;
  margin-right: 15px;
  font-weight: normal;
  font-style: normal;
  font-size: 13px !important;
`;

const MarginCorrect = styled.div``;

const ARTIST_QUERY = graphql`
  query MainContentQuery($id: ID!) {
    artist(id: $id) {
      id
      socialLinks
      images
      avatar
      name
      description
      featuredMedia
      address {
        formatted
        raw
      }
      isVerified
      performanceTypes
      genres
      isCurator
      spotifyProfile
      instagramProfile
      soundcloudProfile
      twitterProfile
      youtubeProfile
      applemusicProfile
      bandcampProfile
    }
  }
`;

export function MainContent({ match }) {
  useInjectReducer({ key: 'MainContent', reducer });
  const {
    params: { artistId },
  } = match;
  const data = useLazyLoadQuery(
    ARTIST_QUERY,
    { id: artistId },
    { fetchPolicy: 'store-and-network' },
  );

  const { width } = useWindowDimensions();
  const [bookingOpen, setBookingOpen] = useState();

  const handleChange = () => {
    setBookingOpen(!bookingOpen);
  };

  if (!data.artist) return null;

  return (
    <BoxContainer>
      <Helmet>
        <title> {data.artist.name}'s Booking Page | Cadenzo</title>
        <meta name="description" content="Description of MainContent" />
      </Helmet>
      <div className="d-flex flex-column full-width">
        <Suspense fallback={<LoadingSpinner />}>
          {width <= deviceSizes.tablet && (
            <>
              <MobileDrawer isOpen={bookingOpen}>
                <Button onClick={handleChange}> Request to Book</Button>
                {
                  <BookingCalendar
                    artist={data.artist}
                    artistId={artistId}
                    inline
                  />
                }
              </MobileDrawer>
              <Header
                artist={data.artist}
                onClick={handleChange}
                bookingOpen={bookingOpen}
                creatorProfile={data.artist}
              />
              <SectionLabel>About</SectionLabel>
              <Description>{data.artist.description}</Description>
              <SectionLabel> Featured Content</SectionLabel>
              {data.artist.applemusicProfile && (
                <Iframely url={data.artist.applemusicProfile} />
              )}
              {data.artist.spotifyProfile && (
                <Iframely url={data.artist.spotifyProfile} />
              )}
              {data.artist.youtubeProfile && (
                <Iframely url={data.artist.youtubeProfile} />
              )}
              {data.artist.bandcampProfile && (
                <Iframely url={data.artist.bandcampProfile} />
              )}
            </>
          )}
          {width > deviceSizes.tablet && (
            <>
              <div className="d-flex flex-column">
                <CreatorHeader creatorProfile={data.artist} />
                <MarginCorrect className="d-flex flex-justify-between">
                  <div className="half-width pl-4 pr-3">
                    <FeaturedContent
                      featuredMedia={data.artist.featuredMedia}
                    />
                  </div>
                  <div className="half-width pr-4 pl-3">
                    <BookingCalendar
                      artist={data.artist}
                      artistId={artistId}
                      inline
                    />
                  </div>
                </MarginCorrect>
                <div className="d-flex flex-justify-around full-width mt-3" />
              </div>
              <div />
            </>
          )}
        </Suspense>
      </div>
    </BoxContainer>
  );
}

MainContent.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  MainContent: makeSelectMainContent(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(withRouter(MainContent));
