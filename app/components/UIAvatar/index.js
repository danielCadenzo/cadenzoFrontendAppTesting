/**
 *
 * UiAvatar
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import avatarProfile from '../../images/icons/user.svg';

const BaseProfileWrapper = styled.div`
  box-sizing: content-box;
  ${({ showBorder }) => (showBorder ? 'border: solid 3px white;' : '')}
`;

const NavLink = styled.a`
  padding: 8px 12px;
  width: fit-content;
  color: black !important;
  cursor: pointer;
  & .short {
    display: none;
  }

  @media (max-width: 400px) {
    & .long {
      display: none;
    }
    & .short {
      display: flex;
    }

    &.mobile-hide {
      display: none;
    }
    filter: invert(100%) sepia(100%) saturate(24%) hue-rotate(6deg)
      brightness(105%) contrast(96%);
  }
`;

const TextBackground = styled.div`
  color: white;
  background-color: #5926cc;
  ${({ showBorder }) => (showBorder ? 'border: solid 3px white;' : '')}
  text-align: center;
  text-align: center;
  vertical-align: middle;
  ${({ height, width }) => `
  height: ${height}px;
  width: ${width}px;
  line-height: ${height}px;
  `}
`;

function UiAvatar({
  profileInfo,
  avatarUrl,
  profileName,
  height = 32,
  className,
  width = 32,
  showBorder,
}) {
  if (!avatarUrl && !profileInfo && !profileName) {
    return (
      <NavLink>
        <img
          alt="anonymous profile avatar"
          height={height}
          width={height}
          src={avatarProfile}
          className="circle"
        />
      </NavLink>
    );
  }
  if (!avatarUrl && profileName)
    return (
      <TextBackground
        className="circle color-white f3"
        height={height}
        showBorder={showBorder}
        width={width}
      >
        {profileName[0].toUpperCase()}
      </TextBackground>
    );

  return (
    <BaseProfileWrapper showBorder={showBorder} className={className}>
      <img
        alt="profile"
        height={height}
        width={height}
        className="circle"
        src={avatarUrl}
      />
    </BaseProfileWrapper>
  );
}

UiAvatar.propTypes = {
  profileInfo: PropTypes.object,
  avatarUrl: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  profileName: PropTypes.string,
  className: PropTypes.string,
  showBorder: PropTypes.bool,
};

export default memo(UiAvatar);
