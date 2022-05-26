import posthog from 'posthog-js';

/**
 * Tracks any event for a user and sends it to post hog
 * @param  {...any} args All the capture events you want to pass
 */
export function trackEvent(...args) {
  if (!window.location.href.includes('127.0.0.1')) {
    posthog.capture(...args);
  }
}
