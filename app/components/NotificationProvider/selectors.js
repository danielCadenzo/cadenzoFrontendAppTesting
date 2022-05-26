import { createSelector } from 'reselect';
import { initialState } from './reducer';

export const selectNotificationProvider = state =>
  state.notifications || initialState;

export const getNotifications = createSelector(
  selectNotificationProvider,
  substate => substate && Object.values(substate.notifications),
);
