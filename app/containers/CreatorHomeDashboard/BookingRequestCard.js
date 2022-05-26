/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 *
 * Modal
 *
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { cadenzoPrimary } from 'utils/CssVariables';
import { connect } from 'react-redux';
import closeIcon from 'images/icons/white_close.svg';
import H2 from 'components/H2';
import UIAvatar from 'components/UIAvatar';
import { ICON_MAP } from 'components/Icon/SocialMediaIcons';
import { getIsActiveProfileAnVenue } from 'data/selectors/authSelectors';
import { createStructuredSelector } from 'reselect';
import GenreTypes from 'constants/GenreTypes';
import PerformanceTypes from 'constants/PerformanceTypes';
import { getOtherProfileFromBooking } from './utils';
import { deviceMax } from '../../constants/ResponsiveSizing/deviceSize';

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 15;
  height: 100%;
  background-color: #2a2a2ade;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${cadenzoPrimary};
  font-weight: 500;
  padding: 10px;
  color: white;
  width: 100%;
  flex-wrap: wrap;
`;

const AvatarContainer = styled.div`
  background-color: ${cadenzoPrimary};
  justify-content: center;
  align-items: center;
`;

const HeaderMainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  justify-content: center;
  margin-left: 5px;
  h5 {
    font-weight: 200;
    margin-bottom: 10px;
  }

  h2 {
    margin-bottom: 20px;
  }
`;

const ModalWrapper = styled.div`
  z-index: 3;
  margin: 3% auto;
  background-color: white;
  max-width: ${props => (props.width ? `${props.width} !important` : '60%')};
  width: 100%;
  max-height: 90%;
  overflow: auto;
  border-radius: 8px;

  @media ${deviceMax.mobileL} {
    width: 100%;
    max-width: unset;
    margin: 20% auto;
  }
`;

const Socials = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;
  svg {
    fill: white;
  }
`;

const HeadingTextContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 31px;

  img {
    margin-left: auto;
    
    &:hover {
      cursor: pointer;
    }
    
  }
  h2 {
    margin-top: 5px;
    margin-left: auto;
  }
`;

const TypeDiv = styled.div`
  display: flex;
  margin-bottom: 10px;
  font-size: 24px;
`;

const AVATAR_SIZE = 150;

function Modal(props) {
  const {
    onClose,
    children,
    header,
    isOpen,
    modalWidth,
    wrapperClassName,
    wrapperProps,
    booking,
    activeProfileIsVenue,
  } = props;

  const closeModal = () => onClose();

  const statusConvert = abrev => {
    switch (abrev) {
      case 'P':
        return 'Pending';
      case 'A':
        return 'Accepted';
      case 'D':
        return 'Declined';
      default:
        return 'Accepted';
    }
  };
  const otherParty = getOtherProfileFromBooking(activeProfileIsVenue, booking);
  const {
    facebookProfile = null,
    instagramProfile,
    twitterProfile = null,
    soundcloudProfile = null,
    spotifyProfile = null,
    youtubeProfile = null,
  } = otherParty.profile;

  const socials = useMemo(() => {
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
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={links[domainKey]}
          color="white"
          fill="white"
          className="mx-1"
        >
          <SocialMediaIcon color="white" fill="white" height={32} width={32} />
        </a>
      );
    });
  }, [activeProfileIsVenue, booking]);

  const renderHeader = () => (
    <ModalHeader>
      <HeadingTextContainer>
        <h2>
          {header} - {statusConvert(booking.status)}
        </h2>
        <img className="p-1" src={closeIcon} alt="close" onClick={closeModal} />
      </HeadingTextContainer>

      <AvatarContainer>
        {activeProfileIsVenue && (
          <UIAvatar
            avatarUrl={booking.performer.avatar}
            height={AVATAR_SIZE}
            width={AVATAR_SIZE}
          />
        )}
        {!activeProfileIsVenue && (
          <UIAvatar
            avatarUrl={booking.venue.avatar}
            height={AVATAR_SIZE}
            width={AVATAR_SIZE}
          />
        )}
      </AvatarContainer>
      <HeaderMainContentContainer>
        {!activeProfileIsVenue && (
          <>
            <h5> Venue </h5>
            <H2>{booking.venue.name}</H2>
            <h5> Preferred Performances </h5>
            <TypeDiv>
              {booking.venue &&
                booking.venue.preferredPerformances &&
                booking.venue.preferredPerformances
                  .map(v => PerformanceTypes[v])
                  .join(', ')}
            </TypeDiv>
          </>
        )}

        {activeProfileIsVenue && (
          <>
            <h5> Artist </h5>
            <H2>{booking.performer.name}</H2>
            <h5> Genre </h5>
            <TypeDiv>
              {booking.performer &&
                booking.performer.genres &&
                booking.performer.genres.map(v => GenreTypes[v]).join(',')}
            </TypeDiv>
          </>
        )}
        <Socials> {socials} </Socials>
      </HeaderMainContentContainer>
    </ModalHeader>
  );

  return (
    <BackDrop hidden={!isOpen} onClick={closeModal}>
      <ModalWrapper
        className={wrapperClassName}
        width={modalWidth}
        onClick={e => e.stopPropagation()}
        {...wrapperProps}
      >
        {renderHeader()}
        <div className="px-4">{children}</div>
      </ModalWrapper>
    </BackDrop>
  );
}

Modal.propTypes = {
  header: PropTypes.string,
  status: PropTypes.string,
  initiatorAvatar: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
  isOpen: PropTypes.bool.isRequired,
  modalWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string,
  wrapperProps: PropTypes.object,
  booking: PropTypes.object,
  activeProfileIsVenue: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  activeProfileIsVenue: getIsActiveProfileAnVenue,
});

Modal.defaultProps = {
  wrapperClassName: '',
  wrapperProps: {},
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Modal);
