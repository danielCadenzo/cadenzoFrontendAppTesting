/**
 *
 * Asynchronously loads the component for UiList
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
