/**
 *
 * Asynchronously loads the component for Badge
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
