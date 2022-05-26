import {
  FAVORITE_EVENT,
  UNFAVORITE_EVENT,
  DELETE_EVENT,
  MARKETPLACE_TICKETS,
  UPLOAD_IMAGE,
  UPDATE_EVENT_COVER,
  UPLOAD_GENERIC_IMAGE,
} from 'data/queries/Event';
import cadenzoApi from './utils';

export const favoriteEvent = ids => cadenzoApi.post(FAVORITE_EVENT, { ids });

export const unfavoriteEvent = ids =>
  cadenzoApi.post(UNFAVORITE_EVENT, { ids });

export const deleteEvent = id => cadenzoApi.post(DELETE_EVENT, { id });

export const fetchMarketplaceTickets = id =>
  cadenzoApi.post(MARKETPLACE_TICKETS, { id });

export const updateEventCover = (coverDataUri, eventId) =>
  cadenzoApi.upload(UPDATE_EVENT_COVER, coverDataUri, {
    isFromDataUri: true,
    variables: { id: eventId },
  });

export const uploadImage = (coverDataUri, filename) =>
  cadenzoApi.upload(UPLOAD_IMAGE, coverDataUri, {
    isFromDataUri: true,
    variables: { filename },
  });

export const uploadGenericImage = (coverDataUri, filename) =>
  cadenzoApi.upload(UPLOAD_GENERIC_IMAGE, coverDataUri, {
    isFromDataUri: true,
    variables: { filename },
  });
