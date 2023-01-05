import type { GetLineDetailsAPIResponse } from './types';
import { baseApi } from 'store/rtk-query';
import { FeatureCollection } from '@turf/turf';

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
    }),
  });
