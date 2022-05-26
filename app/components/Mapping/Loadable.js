/**
 *
 * Asynchronously loads the component for Mapping
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
