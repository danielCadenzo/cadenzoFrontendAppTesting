/*
 * CreateArtistPage Messages
 *
 * This contains all the text for the CreateArtistPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CreateArtistPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the CreateArtistPage container!',
  },
  headerEdit: {
    id: `${scope}.headerEdit`,
    defaultMessage: 'Edit Artist Profile',
  },
  headerCreate: {
    id: `${scope}.headerCreate`,
    defaultMessage: 'Create Artist Profile',
  },
  artistName: {
    id: `${scope}.artistName`,
    defaultMessage: 'Stage name',
  },
  address: {
    id: `${scope}.address`,
    defaultMessage: 'Hometown',
  },
  uploadAvatar: {
    id: `${scope}.uploadAvatar`,
    defaultMessage: 'Upload profile pic',
  },
  artToPerform: {
    id: `${scope}.artToPerform`,
    defaultMessage: 'What type of art do you perform?',
  },
  genreDoYouPlay: {
    id: `${scope}.genreDoYouPlay`,
    defaultMessage: 'What genres do you play?',
  },
  isBand: {
    id: `${scope}.isBand`,
    defaultMessage: 'Are you a Band?',
  },
  artistBio: {
    id: `${scope}.artistBio`,
    defaultMessage: 'Artist bio',
  },
  createProfile: {
    id: `${scope}.createProfile`,
    defaultMessage: 'Create profile',
  },
  editProfile: {
    id: `${scope}.editProfile`,
    defaultMessage: 'Edit profile',
  },
  socialMediaLinks: {
    id: `${scope}.socialMediaLinks`,
    defaultMessage: 'Social media links',
  },
});
