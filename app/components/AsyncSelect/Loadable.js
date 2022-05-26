/**
 *
 * Asynchronously loads the component for AsyncSelect
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
