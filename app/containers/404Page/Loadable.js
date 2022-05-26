/**
 *
 * Asynchronously loads the component for 404Page
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
