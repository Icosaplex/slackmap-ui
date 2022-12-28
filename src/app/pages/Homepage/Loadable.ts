/**
 *
 * Asynchronously loads the component for Homepage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Homepage = lazyLoad(
  () => import('./index'),
  module => module.Homepage,
);
