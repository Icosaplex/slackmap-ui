import { lazyLoad } from 'utils/loadable';

export const SpotDetailPage = lazyLoad(
  () => import('.'),
  module => module.SpotDetailPage,
);
