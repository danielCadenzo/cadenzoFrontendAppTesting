import { FETCH_REVENUE_FOR_TIME_PERIOD } from 'data/queries/FinancialDashboard';
import cadenzoApi from './utils';

export const fetchRevenue = variables =>
  cadenzoApi.post(FETCH_REVENUE_FOR_TIME_PERIOD, variables);
