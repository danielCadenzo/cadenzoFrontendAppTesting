import { GET_SELECTED_EVENT } from 'data/queries/selectedEvent';
import {
  CREATE_EVENT,
  UPDATE_EVENT,
  CREATE_TICKETS,
  EDIT_TICKETS_GROUP,
  DELETE_TICKET_GROUP,
  SET_PUBLISH_STATUS,
} from 'queries/mutations/Events';
import cadenzoApi from './utils';

export const getSelectedEvent = eventGid =>
  cadenzoApi.post(GET_SELECTED_EVENT, { eventGid });

export const createEvent = form => cadenzoApi.post(CREATE_EVENT, form);

export const editEvent = form => cadenzoApi.post(UPDATE_EVENT, form);

export const setPublishStatusForEvent = (id, publishStatus) =>
  cadenzoApi.post(SET_PUBLISH_STATUS, { id, publishStatus });

export const createTicketGroup = ticketForm =>
  cadenzoApi.post(CREATE_TICKETS, ticketForm);

export const updateTicketGroup = ticketForm =>
  cadenzoApi.post(EDIT_TICKETS_GROUP, ticketForm);

export const deleteTicketGroup = id =>
  cadenzoApi.post(DELETE_TICKET_GROUP, { id });
