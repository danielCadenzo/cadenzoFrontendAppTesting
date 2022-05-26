import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ICON_MAP } from 'components/Icon/SocialMediaIcons';
import PropTypes from 'prop-types';
import { device } from '../../constants/ResponsiveSizing/deviceSize';

const VenueImageContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 65vh;
  position: relative;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 15%,
    rgba(255, 255, 255, 0.335171568627451) 49%
  );
`;

const VenueImage = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

const BookButton = styled.button`
  border: 2px solid #5926cc;
  border-radius: 15px;
  background: #5926cc;
  color: white;
  padding: 8px;
  //position: absolute;
  z-index= 3;
  margin-top: 10px;
  margin-bottom: 10px;
  width:75%;
  &:hover {
    background: linear-gradient(58deg, #5926cc 20%, #a84bf5 100%);
    transition: 0.5s;
    
  }
  
  @media ${device.laptop} {
    margin-left: 15px;
  }
`;

const VenueName = styled.h2`
  top: 380px;
  font-weight: bold;
  font-style: normal;
  font-weight: bold;
  font-size: 40px !important;
  line-height: 45px;
  letter-spacing: 0.06em;
  color: #ffffff !important;
  @media ${device.laptop} {
    margin-left: 15px;
  }
`;

const ShadowBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  z-index: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  margin-bottom: 0px;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 15%,
    rgba(6, 0, 0, 0.37718837535014005) 49%
  );

  @media ${device.laptop} {
    align-items: flex-start;
  }
`;

const Socials = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;

  svg {
    fill: white;
  }
`;

function MobileHeader({ venue, onClick }) {
  const socials = useMemo(() => {
    const {
      facebookProfile = null,
      instagramProfile,
      twitterProfile = null,
      soundcloudProfile = null,
      spotifyProfile = null,
      youtubeProfile = null,
    } = venue;
    const links = {
      facebook: facebookProfile,
      instagram: instagramProfile,
      soundcloud: soundcloudProfile,
      twitter: twitterProfile,
      spotify: spotifyProfile,
      youtube: youtubeProfile,
    };
    return Object.keys(links).map(domainKey => {
      const SocialMediaIcon = ICON_MAP[domainKey];
      if (!links[domainKey]) return null;
      return (
        <a rel="noopener noreferrer" target="_blank" href={links[domainKey]}>
          <SocialMediaIcon
            rel="noopener noreferrer"
            target="_blank"
            href={links[domainKey]}
            color="white"
            fill="white"
            className="mx-1"
          />
        </a>
      );
    });
  }, [venue]);
  return (
    <VenueImageContainer>
      <VenueImage alt="profile" src={venue.avatar} />
      <ShadowBox>
        <VenueName> {venue.name} </VenueName>
        <BookButton onClick={onClick}> Book Now </BookButton>
        <Socials>{socials}</Socials>
      </ShadowBox>
    </VenueImageContainer>
  );
}

MobileHeader.propTypes = {
  venue: PropTypes.object,
  onClick: PropTypes.func,
};

export default MobileHeader;
