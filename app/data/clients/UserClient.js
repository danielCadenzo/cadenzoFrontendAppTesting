import {
  FOLLOW_ORGANIZER,
  UNFOLLOW_ORGANIZER,
} from 'data/queries/followOrganizers';

import { CREATE_ARTIST_PROFILE } from 'data/queries/mutations/User';
import cadenzoApi from './utils';

export const followOrganizer = oids =>
  cadenzoApi.post(FOLLOW_ORGANIZER, { oids });

export const unfollowOrganizer = oids =>
  cadenzoApi.post(UNFOLLOW_ORGANIZER, { oids });

export const createArtistProfile = form =>
  cadenzoApi.post(CREATE_ARTIST_PROFILE, form);

export const createHosttProfile = form =>
  cadenzoApi.post(CREATE_ARTIST_PROFILE, form);
