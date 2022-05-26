/*
 *
 * FinancialDashboard reducer
 *
 */
import produce from 'immer';
import { combineReducers } from 'redux';
import { DEFAULT_ACTION } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const connectedEvents = (state = [], action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
    }
  });

export default combineReducers({
  connectedEvents,
});
