'use es6';

import { initialState } from 'data/reducers/auth_reducer';
import { createSelector } from 'reselect';
import { SUCCEEDED, UNINITIALIZED, PENDING } from 'redux/RequestStates';
export const getAuth = state => state.authReducer || initialState;

export const getIsOrganizer = createSelector(
  [getAuth],
  state => state.isOrganizer,
);

export const getAuthRequestStatus = createSelector(
  [getAuth],
  state => state.requestStatus,
);

export const getEmail = createSelector(
  [getAuth],
  state => state.email,
);

export const getIs2faEnabled = createSelector(
  [getAuth],
  state => state.is2faEnabled,
);

export const getPhoneNumber = createSelector(
  [getAuth],
  state => {
    const { phoneNumber } = state;
    if (phoneNumber.length > 2) {
      return phoneNumber.slice(2);
    }
    return phoneNumber;
  },
);

export const getName = createSelector(
  [getAuth],
  state => state.name,
);

export const getUserIsLoggedIn = createSelector(
  [getAuth, getAuthRequestStatus],
  (userAuth, requestState) => !!userAuth.id && requestState === SUCCEEDED,
);

export const getIsAuthLoading = createSelector(
  [getAuthRequestStatus],
  requestState => requestState === UNINITIALIZED || requestState === PENDING,
);

export const getUserIsOrganizer = createSelector(
  [getAuth],
  userAuth => userAuth.isOrganizer,
);

export const getUserAvatar = createSelector(
  [getAuth],
  userAuth => userAuth.avatar,
);

export const getActiveProfileId = createSelector(
  [getAuth],
  userAuth => userAuth.activeProfileId,
);

export const getAttachedArtists = createSelector(
  [getAuth],
  userAuth =>
    (userAuth.attachedArtists || []).map(a => ({
      ...a,
      profileType: 'ARTIST',
    })),
);

export const getAttachedVenues = createSelector(
  [getAuth],
  userAuth =>
    (userAuth.venues || []).map(v => ({ ...v, profileType: 'VENUE' })),
);

export const getAllProfiles = createSelector(
  [getAuth, getAttachedArtists, getAttachedVenues],
  (userAuth, artists, venues) => artists.concat(venues),
);

export const getActiveArtistProfile = createSelector(
  [getAllProfiles, getActiveProfileId],
  (allProfiles, activeProfileId) =>
    allProfiles.find(
      profile =>
        profile.id === activeProfileId && profile.profileType === 'ARTIST',
    ),
);

export const getActiveProfile = createSelector(
  [getAllProfiles, getActiveProfileId],
  (allProfiles, activeProfileId) =>
    allProfiles.find(profile => profile.id === activeProfileId) || null,
);

export const getIsActiveProfileAnArtist = createSelector(
  [getActiveProfile],
  profile => profile && profile.profileType === 'ARTIST',
);

export const getIsActiveProfileAnVenue = createSelector(
  [getActiveProfile],
  profile => profile && profile.profileType === 'VENUE',
);

export const getActiveArtistProfileId = createSelector(
  [getActiveArtistProfile],
  activeProfile => activeProfile && activeProfile.id,
);

export const getActiveArtistProfileName = createSelector(
  [getActiveProfile],
  activeProfile => activeProfile && activeProfile.name,
);

export const getActiveProfileRootId = createSelector(
  [getActiveProfile],
  activeProfile => activeProfile && activeProfile.rId,
);

export const getAllArtistProfileOptions = createSelector(
  [getAttachedArtists],
  artists => ({
    text: 'Artists',
    options: artists.map(artist => ({
      text: artist.name,
      avatar: artist.avatar,
      value: artist.id,
    })),
  }),
);

export const getAllVenueProfileOptions = createSelector(
  [getAttachedVenues],
  venues => ({
    text: 'Venues',
    options: venues.map(venue => ({
      text: venue.name,
      avatar: venue.avatar,
      value: venue.id,
    })),
  }),
);
