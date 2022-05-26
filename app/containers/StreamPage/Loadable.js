/**
 *
 * Asynchronously loads the component for StreamPage
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
