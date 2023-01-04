import type { GetSpotDetailsAPIResponse } from './types';
import { baseApi } from 'store/rtk-query';

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
    }),
  });
