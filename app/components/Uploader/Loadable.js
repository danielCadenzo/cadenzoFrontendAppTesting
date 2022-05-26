/**
 *
 * Asynchronously loads the component for Uploader
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
