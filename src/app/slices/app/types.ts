export interface AppState {
  isUserLoggedIn?: boolean;
  authState?: AuthState;
  snackbarNotification: SnackbarNotification;
  userIdentityType?: UserIdentityType;
  lastMapLocation?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}
export type SnackbarNotification = {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
} | null;

export const enum AuthState {
  Loading = 'loading',
  SigningOut = 'signingOut',
  SignedOut = 'signedOut',
  SigningIn = 'signingIn',
  SignedIn = 'signedIn',
}
