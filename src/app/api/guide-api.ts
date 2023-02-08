import type {
  CreateGuideDetailsPayload,
  GetGuideDetailsAPIResponse,
  UpdateGuideDetailsPayload,
} from './types';
import { baseApi } from 'store/rtk-query';
import { FeatureCollection } from '@turf/turf';
import { showInfoNotification, showSuccessNotification } from 'utils';
import { recordAnalyticsEvent } from 'utils/analytics';

export const guideApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['guideDetails'],
  })
  .injectEndpoints({
    endpoints: builder => ({
      getGuideDetails: builder.query<GetGuideDetailsAPIResponse, string>({
        query: id => ({ url: `guide/${id}/details` }),
        providesTags: ['guideDetails'],
      }),
      getGuideGeoJson: builder.query<FeatureCollection, string>({
        query: id => ({ url: `guide/${id}/geojson` }),
        providesTags: ['guideDetails'],
      }),
      createGuide: builder.mutation<
        GetGuideDetailsAPIResponse,
        CreateGuideDetailsPayload
      >({
        query: body => ({
          url: `guide`,
          method: 'POST',
          body: body,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled.then(() => {
            dispatch(
              showInfoNotification('Refresh the page after few seconds', 5000),
            );
            recordAnalyticsEvent('createGuide');
          });
        },
      }),
      updateGuide: builder.mutation<
        GetGuideDetailsAPIResponse,
        { id: string; payload: UpdateGuideDetailsPayload }
      >({
        query: ({ id, payload }) => ({
          url: `guide/${id}`,
          method: 'PUT',
          body: payload,
        }),
        invalidatesTags: ['guideDetails'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled.then(() => {
            dispatch(showSuccessNotification('Changes Saved'));
            recordAnalyticsEvent('updateGuide');
          });
        },
      }),
      deleteGuide: builder.mutation<void, string>({
        query: id => ({
          url: `guide/${id}`,
          method: 'DELETE',
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled.then(() => {
            dispatch(showSuccessNotification('Guide Deleted'));
            recordAnalyticsEvent('deleteGuide');
          });
        },
      }),
    }),
  });
