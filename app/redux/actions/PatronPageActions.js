import * as client from 'data/clients/PatronPageClient';
import { FETCH_USER_LIST } from 'containers/PatronPage/constants';

export const fetchTicketRevenue = variables => dispatch => {
  client
    .eventAttendeeList(variables)
    .then(data => {
      const { attendeeSearch, attendeeListCount } = data.viewer;
      dispatch({
        type: FETCH_USER_LIST,
        users: attendeeSearch,
        attendeeListCounts: attendeeListCount,
      });
    })
    .catch(() => {});
};
