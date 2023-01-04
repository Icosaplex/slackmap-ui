import type { GetLineDetailsAPIResponse } from './types';
import { baseApi } from 'store/rtk-query';

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
      getLineGeoJson: builder.query<any, string>({
        query: id => ({ url: `line/${id}/geojson` }),
        providesTags: ['lineDetails'],
      }),
    }),
  });
