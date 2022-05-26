import React, { useMemo } from 'react';
import styled from 'styled-components';
import UIAvatar from 'components/UIAvatar';
import ShowMoreText from 'components/ShowMoreText/Loadable';
import { ICON_MAP } from 'components/Icon/SocialMediaIcons';
import { withHttp } from 'utils/validation';
import HeroGrid from './HeroGrid';
import MediaContentPopout from './MediaContentPopout';

const Description = styled.div`
  max-height: 300px;
  height: 100%;
  width: 100%;
  background-color: white;
  box-shadow: 1px 1px 10px 0 rgb(0 0 0 / 15%);
  border-radius: 8px;
`;

const Section = styled.div`
  position: relative;
  display: block;
  width: 100%;
  min-height: 40vh;
  padding-top: 85px;
  overflow: hidden;
`;

const CreatorHeader = ({ creatorProfile }) => {
  const socials = useMemo(() => {
    const {
      facebookProfile = null,
      instagramProfile,
      twitterProfile = null,
      soundcloudProfile = null,
      spotifyProfile = null,
      youtubeProfile = null,
      applemusicProfile = null,
      bandcampProfile = null,
    } = creatorProfile;
    const links = {
      facebook: facebookProfile,
      instagram: instagramProfile,
      soundcloud: soundcloudProfile,
      twitter: twitterProfile,
      spotify: spotifyProfile,
      youtube: youtubeProfile,
      appleMusic: applemusicProfile,
      bandcamp: bandcampProfile,
    };
    return Object.keys(links).map(domainKey => {
      const SocialMediaIcon = ICON_MAP[domainKey];
      if (!links[domainKey]) return null;
      return (
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={withHttp(links[domainKey])}
        >
          <SocialMediaIcon
            fill="black"
            height={32}
            width={32}
            className="color-black mx-1"
          />
        </a>
      );
    });
  }, [creatorProfile]);

  return (
    <div className="d-flex full-width mb-5">
      <div className="d-flex flex-column p-4 quarter-width">
        <div className="d-flex flex-items-center full-width">
          <UIAvatar
            profileInfo={creatorProfile}
            avatarUrl={creatorProfile.avatar}
            profileName={creatorProfile.name}
          />
          <p className="h1 ml-3 color-primary">{creatorProfile.name}</p>
        </div>
        <p className="address mb-4">{creatorProfile.address.formatted}</p>
        <Description className="Box p-2">
          <div className="">
            <ShowMoreText
              expandInModal
              lines={8}
              more="Show more"
              less="Show less"
              anchorClass="my-anchor-css-class"
              expanded={false}
              className="py-4 px-2 roboto Truncate-text"
            >
              {creatorProfile.description}
            </ShowMoreText>
          </div>
        </Description>
        <div className="d-flex p-2 flex-justify-center flex-items-center">
          {socials}
        </div>
      </div>
      <Section>
        <HeroGrid images={creatorProfile.images} />
        <MediaContentPopout images={creatorProfile.images} />
      </Section>
    </div>
  );
};

export default CreatorHeader;
