/**
 *
 * Asynchronously loads the component for UiMain
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
