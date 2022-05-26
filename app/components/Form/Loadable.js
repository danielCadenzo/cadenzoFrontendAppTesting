/**
 *
 * Asynchronously loads the component for Form
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
