/**
 *
 * Asynchronously loads the component for UiBanner
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
