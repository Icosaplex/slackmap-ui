import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/types';
import { initialState } from '.';
import { AuthState } from './types';

const selectSlice = (state?: RootState) => state?.app ?? initialState;

export const selectAuthState = createSelector(
  [selectSlice],
  state => state.authState,
);

export const selectIsUserLoggedIn = createSelector(
  [selectAuthState],
  state => state === AuthState.SignedIn,
);

export const selectSnackbarNotification = createSelector(
  [selectSlice],
  state => state.snackbarNotification,
);
