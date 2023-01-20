import {
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthState } from 'app/slices/app/types';
import { Auth } from 'aws-amplify';
import { showErrorNotification } from 'utils';
import { RootState } from './types';

export const isaAccountApi = createApi({
  reducerPath: 'isaAccountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://qvjz6zmwx1.execute-api.eu-central-1.amazonaws.com/prod/',
    prepareHeaders: async headers => {
      const token = await Auth.currentSession().then(s =>
        s.getIdToken().getJwtToken(),
      );
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_SLACKMAP_API_BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    const isSignedIn =
      (getState() as RootState).app?.authState === AuthState.SignedIn;
    if (isSignedIn) {
      const token = await Auth.currentSession()
        .then(s => s.getIdToken().getJwtToken())
        .catch(() => null);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  endpoints: () => ({}),
});

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => next => action => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      const message = `Error: ${
        action?.payload?.data?.message || action?.error?.message || 'Unknown'
      }`;
      api.dispatch(showErrorNotification(message));
    }

    return next(action);
  };
