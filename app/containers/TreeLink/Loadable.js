/**
 *
 * Asynchronously loads the component for TreeLink
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
