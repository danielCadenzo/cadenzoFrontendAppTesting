import {
  FETCHED_TICKET_REVENUE,
  FETCHED_TICKET_REVENUE_BY_TICKET_GROUP,
} from 'redux/ActionTypes';
import * as client from 'data/clients/FinancialDashboardClient';
import { flattenGQLEdges } from 'utils/helpers';

export const fetchTicketRevenue = form => dispatch => {
  client
    .fetchRevenue(form)
    .then(data => {
      const {
        events,
        viewer: { revenueByTicketGroup },
      } = data;
      const eventsByRevenue = flattenGQLEdges(events.edges);
      if (eventsByRevenue) {
        dispatch({
          type: FETCHED_TICKET_REVENUE,
          payload: eventsByRevenue,
        });
      }

      if (revenueByTicketGroup) {
        dispatch({
          type: FETCHED_TICKET_REVENUE_BY_TICKET_GROUP,
          payload: revenueByTicketGroup,
        });
      }
    })
    .catch(() => {});
};
