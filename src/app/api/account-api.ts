import type { GetUserBasicDetailsAPIResponse } from './types';
import { isaAccountApi } from 'store/rtk-query';

export const accountApi = isaAccountApi
  .enhanceEndpoints({
    addTagTypes: ['accountDetails'],
  })
  .injectEndpoints({
    endpoints: builder => ({
      getBasicDetails: builder.query<GetUserBasicDetailsAPIResponse, void>({
        query: () => ({ url: `basic/userDetails` }),
        providesTags: ['accountDetails'],
      }),
    }),
  });
