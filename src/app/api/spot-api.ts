import type { CreateSpotDetailsPayload, GetSpotDetailsAPIResponse, UpdateSpotDetailsPayload } from './types';
import { baseApi } from 'store/rtk-query';
import { showInfoNotification, showSuccessNotification } from 'utils';

export const spotApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['spotDetails'],
  })
  .injectEndpoints({
    endpoints: builder => ({
      getSpotDetails: builder.query<GetSpotDetailsAPIResponse, string>({
        query: id => ({ url: `spot/${id}/details` }),
        providesTags: ['spotDetails'],
      }),
      getSpotGeoJson: builder.query<any, string>({
        query: id => ({ url: `spot/${id}/geojson` }),
        providesTags: ['spotDetails'],
      }),
      createSpot: builder.mutation<
        GetSpotDetailsAPIResponse,
        CreateSpotDetailsPayload
      >({
        query: body => ({
          url: `spot`,
          method: 'POST',
          body: body,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled.then(() => {
            dispatch(
              showInfoNotification('Refresh the page after few seconds', 5000),
            );
          });
        },
      }),
      updateSpot: builder.mutation<
        GetSpotDetailsAPIResponse,
        { id: string; payload: UpdateSpotDetailsPayload }
      >({
        query: ({ id, payload }) => ({
          url: `spot/${id}`,
          method: 'PUT',
          body: payload,
        }),
        invalidatesTags: ['spotDetails'],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled.then(() => {
            dispatch(showSuccessNotification('Changes Saved'));
          });
        },
      }),
      deleteSpot: builder.mutation<void, string>({
        query: id => ({
          url: `spot/${id}`,
          method: 'DELETE',
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          await queryFulfilled.then(() => {
            dispatch(showSuccessNotification('Spot Deleted'));
          });
        },
      }),
    }),
  });
