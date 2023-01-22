import { lazyLoad } from 'utils/loadable';

export const GuideDetailPage = lazyLoad(
  () => import('.'),
  module => module.GuideDetailPage,
);
