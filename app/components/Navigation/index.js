import React, { useEffect, useMemo } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Routes from 'data/Routes';
import MenuSelect from 'components/MenuSelect';
import PropTypes from 'prop-types';
import { setActiveProfile, fetchViewer } from 'data/actions/AuthActions';
import { createStructuredSelector } from 'reselect';
import UIAvatar from 'components/UIAvatar/Loadable';
import logo from 'images/logos/wordmark_color.png';
import * as AuthSelectors from 'data/selectors/authSelectors';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import { cadenzoPrimary } from 'utils/CssVariables';
import { useWindowDimensions } from 'utils/customHooks';
import ProfileTypes from 'constants/ProfileTypes';
import {
  deviceMax,
  deviceSizes,
} from '../../constants/ResponsiveSizing/deviceSize';

const Wrapper = styled.div`
  z-index: 10;
  width: 100%;
  position: relative;
  background: #f6f6fa;
  padding-left: 45px;
  padding-right: 45px;
  @media ${deviceMax.mobileL} {
    position: fixed;
    bottom: 0px;
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const NavLink = styled.a`
  padding: 8px 12px;
  width: fit-content;
  color: black !important;
  cursor: pointer;
  & .short {
    display: none;
  }

  @media ${deviceMax.mobileL} {
    padding: 8px 10px;
  }
`;

const HomeWrapper = styled.div`
  @media ${deviceMax.mobileL} {
    margin-left: -5px;
  }
`;

const NavigationBarWrapper = styled.div`
  @media (min-width: 350px) and ${deviceMax.mobileL} {
    justify-content: center;
  }
  @media (max-width: 350px) {
    justify-content: left;
  }
`;

const ProfileImageWrapper = styled.div`
  max-height: 48px !important;
  max-width: 48px;
  border: 25%;
`;

const ProfileOptionWrapper = styled.div`
  background-color: ${({ isActive }) =>
    isActive ? cadenzoPrimary : 'inherit'} !important;
  color: ${({ isActive }) => (isActive ? 'white' : 'inherit')} !important;
  ${({ isActive }) => (isActive ? 'border-radius: 4px !important;' : '')}
`;

const ActiveProfileAvatarWrapper = styled(UIAvatar)`
  box-sizing: content-box;
  background-color: white;
  margin-right: -8px;
`;

const ActiveProfileImage = ({
  activeProfile,
  baseProfileAvatar,
  baseProfileName,
}) => {
  if (!activeProfile || !activeProfile.id) {
    return (
      <UIAvatar profileUrl={baseProfileAvatar} profileName={baseProfileName} />
    );
  }
  return (
    <div className="d-flex flex-row-reverse">
      <UIAvatar
        profileName={baseProfileName}
        avatarUrl={activeProfile.avatar}
      />
      <ActiveProfileAvatarWrapper
        alt={activeProfile.name}
        profileName={activeProfile.name}
      />
    </div>
  );
};

const ProfileOption = ({ profile, isActive = false }) => (
  <ProfileOptionWrapper
    isActive={isActive}
    className="d-flex flex-items-center full-width"
  >
    <ProfileImageWrapper>
      <UIAvatar
        avatarUrl={profile.avatar}
        profileName={profile.name}
        profileInfo={profile}
      />
    </ProfileImageWrapper>
    <p className="f4 pl-3 roboto">{profile.name}</p>
  </ProfileOptionWrapper>
);

function Navigation(props) {
  const {
    fetchUserInfo,
    isLoggedIn,
    venues,
    artistProfiles,
    location,
    activeProfile,
    baseProfileAvatar,
    setActiveUser,
    baseProfileEmail,
  } = props;

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const { width } = useWindowDimensions();
  const { pathname } = location;

  const ordereredArtistProfiles = useMemo(
    () =>
      artistProfiles.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;

        return 0;
      }),
    [artistProfiles],
  );

  const ordereredVenueProfiles = useMemo(
    () =>
      venues.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;

        return 0;
      }),
    [venues],
  );

  const loggedInOptions = useMemo(
    () => [
      { text: 'Account', value: Routes.account() },
      { text: 'Messages', value: Routes.chat() },
      { text: 'Create Artist', value: Routes.createArtistProfile() },
      { text: 'Create Venue', value: Routes.createVenueProfile() },
    ],
    [],
  );

  const profileOptions = useMemo(() => {
    const options = [
      ...(isLoggedIn ? loggedInOptions : []),
      {
        text: (
          <p style={isLoggedIn ? { color: 'red' } : {}}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </p>
        ),
        value: isLoggedIn ? Routes.signout() : Routes.login(),
      },
    ];

    if (ordereredVenueProfiles.length > 0) {
      options.push({
        text: <p className="h3">My Venues</p>,
        options: ordereredVenueProfiles.map(venue => ({
          text: (
            <ProfileOption
              profile={venue}
              isActive={activeProfile && activeProfile.id === venue.id}
            />
          ),
          avatar: venue.avatar,
          value: venue.id,
          isProfile: true,
        })),
      });
    }

    if (ordereredArtistProfiles.length > 0) {
      options.push({
        text: <p className="h3 py-1">My Artists</p>,
        options: ordereredArtistProfiles.map(artist => ({
          text: (
            <ProfileOption
              isActive={activeProfile && activeProfile.id === artist.id}
              profile={artist}
            />
          ),
          avatar: artist.avatar,
          value: artist.id,
          isProfile: true,
        })),
      });
    }

    return options;
  }, [ordereredVenueProfiles, ordereredArtistProfiles, activeProfile]);

  const onAccountSelect = option => {
    if (!option.isProfile) window.location.href = option.value;
    localStorage.setItem('activeProfileId', option.value);
    setActiveUser(option.value);
  };
  return (
    <>
      <Wrapper className=" d-flex full-width  flex-justify-between">
        <HomeWrapper className="d-flex flex-items-center">
          {width <= deviceSizes.mobileL && (
            <button type="button" tabIndex="0" onClick={Routes.home}>
              <img
                className="cursor-pointer"
                height={15}
                alt="Cadenzo logo"
                src={logo}
              />
            </button>
          )}
          {width > deviceSizes.mobileL && (
            <button type="button" tabIndex="0" onClick={Routes.home}>
              <img
                className="cursor-pointer"
                height={20}
                alt="Cadenzo logo"
                src={logo}
              />
            </button>
          )}
        </HomeWrapper>
        <NavigationBarWrapper className="d-flex flex-items-center flex-shrink-0">
          {isLoggedIn && !isEmpty(activeProfile) && (
            <NavLink
              className="color-black mobile-hide f3"
              href={
                activeProfile.type === ProfileTypes.ARTIST
                  ? Routes.editArtistProfile(activeProfile.id)
                  : Routes.editVenueProfile(activeProfile.id)
              }
            >
              <p className="color-black cursor-pointer long work-sans">
                My Profile
              </p>
            </NavLink>
          )}
          {isLoggedIn && (
            <NavLink
              className="color-black cursor-pointer f3"
              href={Routes.homeDashboard()}
            >
              <p
                className={`long work-sans ${
                  [Routes.homeDashboard(), '/'].includes(pathname)
                    ? 'color-primary'
                    : 'color-black'
                }`}
              >
                Dashboard
              </p>
            </NavLink>
          )}
          {isLoggedIn && !isEmpty(activeProfile) && (
            <NavLink
              className="color-black mobile-hide f3"
              href={
                activeProfile.type === ProfileTypes.ARTIST
                  ? Routes.discoverVenues()
                  : Routes.discoverArtists()
              }
            >
              <p
                className={`color-black cursor-pointer long work-sans ${
                  [Routes.discoverVenues(), Routes.discoverArtists()].includes(
                    pathname,
                  )
                    ? 'color-primary'
                    : 'color-black'
                }`}
              >
                Discover
              </p>
            </NavLink>
          )}
          {!isLoggedIn && (
            <NavLink className="color-black mobile-hide" href={Routes.login()}>
              <p className="long work-sans ">Login</p>
            </NavLink>
          )}
          <MenuSelect options={profileOptions} onSelect={onAccountSelect}>
            <NavLink>
              <ActiveProfileImage
                baseProfileAvatar={baseProfileAvatar}
                baseProfileName={baseProfileEmail}
                activeProfile={activeProfile}
              />
            </NavLink>
          </MenuSelect>
        </NavigationBarWrapper>
      </Wrapper>
    </>
  );
}
// href={Routes.account()}
Navigation.defaultProps = {
  isLoggedIn: false,
  venues: [],
};

Navigation.propTypes = {
  artistProfiles: PropTypes.array,
  fetchUserInfo: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  setActiveUser: PropTypes.func.isRequired,
  venues: PropTypes.array,
};

const mapDispatchToProps = {
  setActiveUser: setActiveProfile,
  fetchUserInfo: fetchViewer,
};

const stateToProps = createStructuredSelector({
  isOrganizer: AuthSelectors.getUserIsOrganizer,
  isLoggedIn: AuthSelectors.getUserIsLoggedIn,
  venues: AuthSelectors.getAttachedVenues,
  artistProfiles: AuthSelectors.getAttachedArtists,
  activeProfile: AuthSelectors.getActiveProfile,
  baseProfileAvatar: AuthSelectors.getUserAvatar,
  baseProfileEmail: AuthSelectors.getEmail,
});

const withConnect = connect(
  stateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(withRouter(Navigation));
