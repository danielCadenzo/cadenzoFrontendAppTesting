/**
 *
 * Asynchronously loads the component for VenueDesigner
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
