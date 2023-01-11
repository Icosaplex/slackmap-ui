import type {
  GetLineDetailsAPIResponse,
  UpdateLineDetailsPayload,
} from './types';
import { baseApi } from 'store/rtk-query';
import { FeatureCollection } from '@turf/turf';
import { showSuccessNotification } from 'utils';

export const lineApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['lineDetails'],
  })
  .injectEndpoints({
    endpoints: builder => ({
      getLineDetails: builder.query<GetLineDetailsAPIResponse, string>({
        query: id => ({ url: `line/${id}/details` }),
        providesTags: ['lineDetails'],
      }),
      getLineGeoJson: builder.query<FeatureCollection, string>({
        query: id => ({ url: `line/${id}/geojson` }),
        providesTags: ['lineDetails'],
      }),
      updateLine: builder.mutation<
        GetLineDetailsAPIResponse,
        UpdateLineDetailsPayload
      >({
        query: body => ({
          url: `line/${body.id}`,
          method: 'PUT',
          body: body,
        }),
        invalidatesTags: ['lineDetails'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled;
          dispatch(showSuccessNotification('Changes Saved'));
        },
      }),
    }),
  });
