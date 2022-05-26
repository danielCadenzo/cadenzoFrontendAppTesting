/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  getUserIsLoggedIn,
  getIsAuthLoading,
} from 'data/selectors/authSelectors';
import styled from 'styled-components';
import PrivacyPage from 'containers/PrivacyPage/Loadable';
import TermsPage from 'containers/PrivacyPage/AsyncTermPage';
import { IntercomProvider } from 'react-use-intercom';
import NotificationProvider from 'components/NotificationProvider';
import Calendly from 'containers/Calendly/Loadable';
import Navigation from '../../components/Navigation';
import CreatorDashboard from '../CreatorHomeDashboard/Loadable';
import LandingPage from '../EventLandingPage/Loadable';
import PatronPage from '../PatronPage/Loadable';
import CreateEventPage from '../CreateEventPage';
import TreeLinkPage from '../TreeLink/Loadable';
import LoginPage from '../LoginPage/Loadable';
import ReviewPage from '../ReviewPage/Loadable';
import SupportPage from '../SupportPage';
import Page404 from '../404Page/Loadable';
import AccountPage from '../AccountPage/Loadable';
import ViewTicketPage from '../ViewTicketPage/Loadable';
import CreateArtistPage from '../CreateArtistPage/Loadable';
import CreateHostPage from '../CreateHostPage/Loadable';
import ChatPage from '../ChatPage/Loadable';
import VenueBookingPage from '../VenueBookingPage/Loadable';
import DiscoveryPage from '../DiscoveryPage/Loadable';
import GlobalStyle from '../../global-styles';
import ArtistBookingPage from '../ArtistBookingPage/Loadable';
import ProfileOnboarding from '../AccountPage/ProfileOnboarding';
import ErrorBoundary from '../../components/ErrorBoundary';
import 'react-datepicker/dist/react-datepicker.css';
import { deviceMax } from '../../constants/ResponsiveSizing/deviceSize';
const INTERCOM_APP_ID = 'zmp1qg47';
const MainContainer = styled.div`
  width: 100% !important;
  height: 100%;
  z-index: 0;
  @media ${deviceMax.mobileL} {
    position: relative;
    overflow: auto;
    margin-bottom: 85px;
    background-color: white;
  }
`;

class App extends React.Component {
  render() {
    const { location } = window;
    return (
      <IntercomProvider appId={INTERCOM_APP_ID}>
        <MainContainer>
          <NotificationProvider>
            <ErrorBoundary key={location.pathname}>
              <Switch>
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/signup" component={LoginPage} />
                <Route exact path="/signout" component={LoginPage} />
                <Route exact path="/reviews/:reviewId" component={ReviewPage} />
                <Route exact path="/reset-password" component={LoginPage} />
                <Route
                  exact
                  path="/accounts/reset/:id/:token"
                  component={LoginPage}
                />
                <MainContainer>
                  <Navigation />
                  <Route
                    exact
                    path="/dashboard/patrons"
                    component={PatronPage}
                  />
                  <Route exact path="/support" component={SupportPage} />
                  <Route path="/account" component={AccountPage} />
                  <Route
                    exact
                    path="/ticket/view/:eId/:ticketId"
                    component={ViewTicketPage}
                  />
                  <Route
                    exact
                    path="/profile/onboarding"
                    component={ProfileOnboarding}
                  />

                  <Route exact path="/" component={CreatorDashboard} />
                  <Route exact path="/events" component={LandingPage} />

                  <Route exact path="/privacy" component={PrivacyPage} />
                  <Route exact path="/terms" component={TermsPage} />
                  <Route
                    exact
                    path="/dashboard/home"
                    component={CreatorDashboard}
                  />
                  <Route exact path="/treelink" component={TreeLinkPage} />
                  <Route exact path="/l/:companyId" component={TreeLinkPage} />
                  <Route
                    exact
                    path="/create/event"
                    component={CreateEventPage}
                  />
                  <Route
                    exact
                    path="/create/artist"
                    component={CreateArtistPage}
                  />
                  <Route exact path="/create/host" component={CreateHostPage} />
                  <Route
                    exact
                    path="/edit/host/:hostId"
                    component={CreateHostPage}
                  />
                  <Route
                    exact
                    path="/create/venue"
                    component={CreateHostPage}
                  />
                  <Route
                    exact
                    path="/edit/venue/:hostId"
                    component={CreateHostPage}
                  />
                  <Route
                    exact
                    path="/edit/artist/:artistId"
                    component={CreateArtistPage}
                  />
                  <Route exact path="/chat" component={ChatPage} />
                  <Route
                    exact
                    path="/s/:cityName/venues"
                    component={DiscoveryPage}
                  />
                  <Route
                    exact
                    path="/discover/venues"
                    component={DiscoveryPage}
                  />
                  <Route
                    exact
                    path="/discover/artists"
                    component={DiscoveryPage}
                  />
                  <Route
                    exact
                    path="/book/host/:hostId"
                    component={VenueBookingPage}
                  />
                  <Route
                    exact
                    path="/book/artist/:artistId"
                    component={ArtistBookingPage}
                  />
                  <Route exact path="/hosts" component={DiscoveryPage} />
                  <Route
                    exact
                    path="/booking/calendar/:profileId"
                    component={Calendly}
                  />
                </MainContainer>
                <Route component={Page404} />
              </Switch>
            </ErrorBoundary>
            <GlobalStyle />
          </NotificationProvider>
        </MainContainer>
      </IntercomProvider>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = state => ({
  userIsLoggedIn: getUserIsLoggedIn(state),
  authIsPending: getIsAuthLoading(state),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
