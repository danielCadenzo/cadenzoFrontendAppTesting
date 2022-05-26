/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from 'utils/history';
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import patronPage from 'redux/reducers/patronPage';
import eventsPage from 'containers/EventManagementPage/reducer';
import authReducer from 'data/reducers/auth_reducer';
import dashboardReducer from 'data/reducers/dashboard_reducer';
import landingPageReducer from 'containers/EventLandingPage/reducer';
import eventPageReducer from 'containers/EventPage/reducer';
import selectedEventReducer from 'redux/reducers/selectedEventReducer';
import favoritedEventsReducer from 'redux/reducers/favoritedEventsReducer';
import venueDesignerReducer from 'redux/reducers/designManagerReducer';
import financialDashboard from 'redux/reducers/financialDashboardReducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    authReducer,
    language: languageProviderReducer,
    router: connectRouter(history),
    dashboard: dashboardReducer,
    eventPage: eventPageReducer,
    financialDashboard,
    patronPage,
    eventsPage,
    landingPage: landingPageReducer,
    selectedEvent: selectedEventReducer,
    favoriteEvents: favoritedEventsReducer,
    venueDesigner: venueDesignerReducer,
    ...injectedReducers,
  });

  return rootReducer;
}
