const isProduction =
  process.env.NODE_ENV === 'production' ||
  window.location.origin === 'https://www.cadenzotickets.com';

export const STRIPE_PUBLIC_KEY = isProduction
  ? 'pk_live_PwKXYCh4Z7B0PwKm1utedCB500pnM3XQf9'
  : 'pk_test_5fuIzA9df8PvSeQVpzuQGp4D007Vk4Ozck';
