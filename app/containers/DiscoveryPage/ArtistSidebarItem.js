'use es6';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import Routes from 'data/Routes';
import PropTypes from 'prop-types';
import avatarDefault from 'images/artist_default_avatar.jpg';
import Genres from 'constants/GenreTypes';

import {
  spotify,
  twitter,
  instagram,
  soundcloud,
  appleMusic,
} from 'components/Icon/SocialMediaIcons';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { withHttp } from 'utils/validation';
import Iframely from '../../components/IFramely';

const ICON_MAP = Object.freeze({
  spotify,
  twitter,
  instagram,
  soundcloud,
  appleMusic,
  youtube: YouTubeIcon,
});

const SOCIAL_MEDIA_DOMAINS = Object.freeze({
  twitter: 'twitter',
  instagram: 'instagram',
  soundcloud: 'soundcloud',
  appleMusic: 'apple',
  spotify: 'spotify',
  youtube: 'youtube',
});

const LinkWrapper = styled.a`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #dadada;
  padding-bottom: 8px;
  background: #fff;
  border-radius: 20px;
  flex: 0 0 100%;
  margin-bottom: 20px;
  height: 315px;
  width: 309px;
  min-width: 309px;
  color: #343a40;

  background: #ffffff;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 18px;

  @media (min-width: 768px) {
    flex: 0 0 27%;
  }

  @media (min-width: 1024px) {
    flex: 0 0 21%;
  }
`;

const InfoWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
`;

const ImageWrapper = styled.div`
  -ms-flex-negative: 0 !important;
  -webkit-box-flex: 0 !important;
  -ms-flex-positive: 0 !important;
  -webkit-flex-grow: 0 !important;
  flex-grow: 0 !important;
  -webkit-flex-shrink: 0 !important;
  flex-shrink: 0 !important;
  margin-top: -4px;
  width: 100% !important;
  height: auto !important;
  max-height: 160px;
  border-radius: 12px !important;
  background-color: black;
`;

const OverflowClipper = styled.div`
  overflow: clip !important;
  border-radius: 12px;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
`;

const ImageBackgroundContainer = styled.div`
  background: rgb(235, 235, 235);
`;

const Image = styled.div`
  background-image: url(${({ src }) => src});
  background-size: cover;
  border-radius: 0px;
  vertical-align: bottom !important;
  height: 200px !important;
  width: 100% !important;
  max-height: 160px;
  background-position: center;
  background-repeat: no-repeat !important;
`;

const Socials = styled.span`
  z-index: 4;
  padding-bottom: 8px;
  margin-top: 15px;
`;

function ArtistSidebarItem({ artist }) {
  const artistHeaderImage = useMemo(() => {
    const { images = [], avatar } = artist;
    if (avatar) return avatar;
    if (images.length) return images[0];

    return avatarDefault;
  }, []);

  const artistFeaturedMedia = artist.featuredMedia;

  const artistGenresText = useMemo(
    () => artist.genres.map(genre => Genres[genre]).join(','),
    [artist.genres],
  );

  const socials = useMemo(() => {
    const socialMediaProfiles = [];
    if (artist.spotifyProfile) socialMediaProfiles.push(artist.spotifyProfile);
    if (artist.instagramProfile)
      socialMediaProfiles.push(artist.instagramProfile);
    if (artist.soundcloudProfile)
      socialMediaProfiles.push(artist.soundcloudProfile);
    if (artist.twitterProfile) socialMediaProfiles.push(artist.twitterProfile);
    if (artist.youtubeProfile) socialMediaProfiles.push(artist.youtubeProfile);
    if (artist.appleMusicProfile)
      socialMediaProfiles.push(artist.appleMusicProfile);

    return socialMediaProfiles.reduce((acc, socialLink) => {
      let domain = new URL(withHttp(socialLink));
      domain = domain.hostname.replace('www.', '');
      domain = domain.replace('.com', '');
      if (SOCIAL_MEDIA_DOMAINS[domain]) {
        acc[domain] = socialLink;
        return acc;
      }
      return acc;
    }, {});
  }, [
    artist.spotifyProfile,
    artist.instagramProfile,
    artist.appleMusicProfile,
  ]);

  const artistHometown = useMemo(() => {
    const parsedAddress = artist.hometown.raw.split(',');
    if (parsedAddress) return parsedAddress[0];
    return '';
  }, [artist.hometown]);

  const featuredMedia = useMemo(() => {
    if (!artistFeaturedMedia) return null;
    return artistFeaturedMedia.map(featured => <Iframely url={featured} />);
  }, [artist.genres]);

  return (
    <LinkWrapper
      href={Routes.artistBookingPage(artist.id)}
      rel="noopener noreferrer"
    >
      <ImageWrapper>
        <OverflowClipper>
          <ImageBackgroundContainer>
            <Image src={artistHeaderImage} className="full-width" />
          </ImageBackgroundContainer>
        </OverflowClipper>
      </ImageWrapper>
      <InfoWrapper>
        <p className="text-light roboto f3 pt-1">{artist.name}</p>
        <div className="Box">
          <span className="Truncate">
            <span className="Truncate-text f4">{artistHometown}</span>
          </span>
        </div>
        <div className="Box  mt-3" style={{ color: '#9F9F9F' }}>
          <span className="Truncate">
            <span className="Truncate-text">{artistGenresText}</span>
          </span>
        </div>
        <div className="f5 color-gray roboto float-right pt-1">
          <Socials>
            {Object.keys(socials).map(domainKey => {
              const SocialMediaIcon = ICON_MAP[domainKey];
              return (
                <a href={socials[domainKey]}>
                  <SocialMediaIcon
                    fill="color-black"
                    height={32}
                    width={32}
                    className="color-black mx-1"
                    margin-right="15px"
                  />
                </a>
              );
            })}
          </Socials>
        </div>
      </InfoWrapper>
    </LinkWrapper>
  );
}

ArtistSidebarItem.propTypes = {
  artist: PropTypes.object.isRequired,
};

export default ArtistSidebarItem;
