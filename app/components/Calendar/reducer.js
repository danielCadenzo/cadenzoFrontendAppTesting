/*
 *
 * ArtistBookingPage reducer
 *
 */
import produce from 'immer';
import { SUCCEEDED, PENDING } from 'redux/RequestStates';
import { merge } from 'lodash';
import { FETCH_TIMERANGE, FETCH_TIMERANGE_SUCCESS } from './constants';

export const initialState = {
  calendarByDate: {},
  requestStatus: {},
};

/* eslint-disable default-case, no-param-reassign */
const calendarReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case FETCH_TIMERANGE_SUCCESS: {
        const { timeRangeStr, availabilityByDate, id } = action.payload;
        const newData = {
          calendarByDate: {
            [id]: {
              ...availabilityByDate,
            },
          },
          requestStatus: {
            [id]: {
              [timeRangeStr]: SUCCEEDED,
              timestamp: new Date().getTime(),
            },
          },
        };
        const newState = merge(state, newData);
        return { ...newState };
      }
      case FETCH_TIMERANGE: {
        const { timeRangeStr, id } = action.payload;
        const requestData = {
          requestStatus: {
            [id]: {
              [timeRangeStr]: PENDING,
            },
          },
        };
        return { ...merge(state, requestData) };
      }
      default:
        return state;
    }
  });

export default calendarReducer;
