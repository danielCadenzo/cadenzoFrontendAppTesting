'use es6';

import { createSelector } from 'reselect';

export const getFinancialDashboard = state => state.financialDashboard;

export const getTicketRevenue = () =>
  createSelector(
    [getFinancialDashboard],
    state => state.ticketRevenue,
  );

export const getTicketRevenueByGroup = () =>
  createSelector(
    [getFinancialDashboard],
    state => state.ticketRevenueByGroup,
  );

export const getTicketRevenueAggAmount = () =>
  createSelector(
    [getFinancialDashboard],
    state =>
      state.ticketRevenue.reduce((acc, value) => acc + value.totalRevenue, 0),
  );

export const getTicketGroupRevenueAggAmount = () =>
  createSelector(
    [getTicketRevenueByGroup()],
    tcktGrps => tcktGrps.reduce((acc, value) => acc + value.value, 0),
  );
