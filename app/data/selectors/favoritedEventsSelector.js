import { createSelector } from 'reselect';

const getSelectedEvent = state => state.favoritedEvents;

export const getEventData = () =>
  createSelector(
    [getSelectedEvent],
    eventData => (eventData.selectedEvent ? eventData.selectedEvent : {}),
  );
