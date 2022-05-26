/**
 *
 * Asynchronously loads the component for UiScrollContainer
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
