/**
 *
 * Asynchronously loads the component for UiAvatar
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
