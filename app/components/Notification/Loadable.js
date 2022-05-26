/**
 *
 * Asynchronously loads the component for Notification
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
