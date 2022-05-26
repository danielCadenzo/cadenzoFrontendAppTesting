import { createSelector } from 'reselect';

/**
 * Direct selector to the patronPage state domain
 */

const getSelectedEvent = state => state.selectedEvent || null;

const getReservedTicketHolders = state => {
  if (state && state.selectedEvent) {
    return Object.values(state.selectedEvent.ticketGroupHolds);
  }
  return [];
};

export const getEventData = () =>
  createSelector(
    [getSelectedEvent],
    eventData => (eventData.selectedEvent ? eventData.selectedEvent : {}),
  );

export const getIsEventSelected = () =>
  createSelector(
    [getSelectedEvent],
    eventData => !!eventData.selectedEvent,
  );

export const getEvent = () =>
  createSelector(
    [getEventData(), getIsEventSelected()],
    (selectedEvent, isEventSelected) => {
      if (isEventSelected) {
        const { event } = selectedEvent;
        return event;
      }
      return null;
    },
  );

const getSelectedEventField = field =>
  createSelector(
    [getEventData(), getIsEventSelected()],
    (selectedEvent, isEventSelected) => {
      if (isEventSelected) {
        const { event } = selectedEvent;
        return event[field];
      }
      return null;
    },
  );

export const getSelectedEventName = () => getSelectedEventField('title');

export const getSelectedTicketGroup = () =>
  createSelector(
    [getSelectedEvent],
    eventData =>
      eventData.selectedTicketGroup ? eventData.selectedTicketGroup : null,
  );

export const getTicketGroupReservedTickets = () =>
  createSelector(
    getSelectedTicketGroup(),
    getReservedTicketHolders,
    (ticketGroup, updatedTicketHolders) => {
      if (ticketGroup) {
        const { ticketHolders: reservedTickets } = ticketGroup;
        const allHolders = reservedTickets.concat(updatedTicketHolders);
        return Object.values(
          allHolders.reduce((acc, userHolder) => {
            const { email } = userHolder;
            acc[email] = { id: email, ...userHolder };
            return acc;
          }, {}),
        );
      }
      return [];
    },
  );

export const getTotalReservedTicketsForGroup = () =>
  createSelector(
    getTicketGroupReservedTickets(),
    allTicketHolders => {
      if (allTicketHolders.length > 0) {
        return allTicketHolders.reduce(
          (acc, userHolder) => acc + userHolder.amountHeld,
          0,
        );
      }
      return 0;
    },
  );
