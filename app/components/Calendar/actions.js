import { PENDING, SUCCEEDED } from 'redux/RequestStates';
import { createGQLQuery } from 'data/api';
import {
  FETCH_TIMERANGE,
  FETCH_TIMERANGE_SUCCESS,
  ARTIST_QUERY,
  VENUE_QUERY,
  ISO_FORMAT,
} from './constants';

export const fetchCalendarRange = (isForVenue, variables) => dispatch => {
  const { id, showAvailabilityDetail = false, startDate, endDate } = variables;
  const timeRangeStr = `${startDate.toISOString().slice(0, 10)} - ${endDate.toISOString().slice(0, 10)}`;
  console.log('startDate : ' + startDate)
  console.log(' endDate.toISOString().slice(0, 10)  : ' + endDate.toISOString().slice(0, 10))

  dispatch({
    type: FETCH_TIMERANGE,
    meta: { status: PENDING },
    payload: {
      timeRangeStr,
      id,
    },
  });
  createGQLQuery(isForVenue ? VENUE_QUERY : ARTIST_QUERY, {
    id,
    showAvailabilityDetail,
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  }).then(data => {
    const availabilityByDate = {};
    const propertyKey = isForVenue ? 'venue' : 'artist';
    if (!data[propertyKey].calendar) {
      dispatch({
        type: FETCH_TIMERANGE_SUCCESS,
        meta: { status: SUCCEEDED },
        payload: {
          timeRangeStr,
          availabilityByDate,
          id,
        },
      });
    } else {
      data[propertyKey].calendar.bookingAvailability.forEach(availability => {
        availabilityByDate[availability.calendarDate] = availability;
      });
      dispatch({
        type: FETCH_TIMERANGE_SUCCESS,
        meta: { status: SUCCEEDED },
        payload: {
          timeRangeStr,
          availabilityByDate,
          id,
        },
      });
    }
  });
};
