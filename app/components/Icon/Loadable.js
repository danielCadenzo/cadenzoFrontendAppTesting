/**
 *
 * Asynchronously loads the component for Icon
 *
 */
import React from 'react';
import loadable from 'utils/loadable';

export const TrashIcon = () =>
  loadable(() => import('./index').then(module => module.TrashIcon));
