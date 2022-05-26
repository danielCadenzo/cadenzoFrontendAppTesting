import React from 'react';
import loadable from 'utils/loadable';
import LoadingSpinner from 'components/LoadingSpinner';

export default loadable(() => import('./AvailabilityContainer'), {
  fallback: <LoadingSpinner />,
});
