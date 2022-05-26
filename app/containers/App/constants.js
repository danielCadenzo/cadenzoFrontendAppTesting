export const EventTypes = {
  Music: 'Music',
  Festival: 'Festival',
  Musical: 'Musical',
  Concert: 'Concert',
  ArtsAndEntertainment: 'Arts & Entertainment',
  Business: 'Business',
  Sports: 'Sports',
};

export const NON_AUTH_ROUTES = new Set(
  '/login',
  '/signup',
  '/reset-password',
  '',
);
export const NON_AUTH_REGEX_PATHS = Object.freeze([
  new RegExp('/accounts/reset/.*/.*'),
  new RegExp('/booking/calendar/.*'),
]);
