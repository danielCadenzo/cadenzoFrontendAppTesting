import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the financialDashboard state domain
 */

const selectFinancialDashboardDomain = state =>
  state.financialDashboard || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by FinancialDashboard
 */

const makeSelectFinancialDashboard = () =>
  createSelector(
    selectFinancialDashboardDomain,
    substate => substate,
  );

export default makeSelectFinancialDashboard;
export { selectFinancialDashboardDomain };
