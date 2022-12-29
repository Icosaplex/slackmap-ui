import { lazyLoad } from 'utils/loadable';

export const LineDetailPage = lazyLoad(
  () => import('./index'),
  module => module.LineDetailPage,
);
