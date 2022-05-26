/**
 *
 * Asynchronously loads the component for QrCode
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
