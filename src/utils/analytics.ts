import { Analytics } from 'aws-amplify';

type AnalyticsEvent =
  | 'createLine'
  | 'updateLine'
  | 'deleteLine'
  | 'createSpot'
  | 'updateSpot'
  | 'deleteSpot'
  | 'createGuide'
  | 'updateGuide'
  | 'deleteGuide';

export const recordAnalyticsEvent = (event: AnalyticsEvent, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    Analytics.record({
      name: event,
      attributes: data,
    });
  }
};
