import { lazyLoad } from 'utils/loadable';

export const LineDetailPage = lazyLoad(
  () => import('.'),
  module => module.LineDetailPage,
);
