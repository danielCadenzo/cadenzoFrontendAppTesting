export const getEventIdFromPath = () => {
  const { pathname } = window.location;
  const id = pathname.split('event/')[1];
  if (id) return id;
  return null;
};

export const getWindowOrigin = () => window.location.origin;

export default Object.freeze({
  eventDashboard(id = '') {
    return `/dashboard/event/${id}`;
  },
  venueBookingPage(venueGId) {
    return `/book/host/${venueGId}`;
  },
  artistBookingPage(artistGId) {
    return `/book/artist/${artistGId}`;
  },
  homeDashboard() {
    return '/dashboard/home';
  },
  patronDashboard() {
    return '/dashboard/patrons';
  },
  financialDashboard() {
    return '/dashboard/financial';
  },
  eventPage(eventGid) {
    return `/event/${eventGid}`;
  },
  editArtistProfile(gId) {
    return `/edit/artist/${gId}`;
  },
  editVenueProfile(gId) {
    return `/edit/host/${gId}`;
  },
  passwordReset() {
    return '/reset-password';
  },
  createEvent() {
    return '/create/event';
  },
  createArtistProfile() {
    return '/create/artist';
  },
  createVenueProfile() {
    return '/create/host';
  },
  discoverArtists() {
    return '/discover/artists';
  },
  discoverVenues() {
    return '/discover/venues';
  },
  homeLink() {
    return '/';
  },
  chat() {
    return '/chat';
  },
  login() {
    return '/login';
  },
  support() {
    return '/support';
  },
  account() {
    return '/account';
  },
  profileOnboarding() {
    return '/profile/onboarding';
  },
  calendar(profileId) {
    return `/account/calendar/${profileId}`;
  },
  bookingCalendar(profileId) {
    return `/booking/calendar/${profileId}`;
  },
  accountSecurity() {
    return '/account/security';
  },
  accountPersonalInfo() {
    return '/account/personal-info';
  },
  accountPaymentMethods() {
    return '/account/payment-methods';
  },
  tickets() {
    return '/account/tickets';
  },
  about() {
    return 'https://www.cadenzotickets.com/about';
  },
  home() {
    window.location.href = `/`;
  },
  signout() {
    return '/signout';
  },
  designManager(venueId = '') {
    return `/venue/design/${venueId}`;
  },
});
