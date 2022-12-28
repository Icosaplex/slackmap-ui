import { appActions } from 'app/slices/app';

export function showSuccessNotification(message: string) {
  return appActions.updateSnackbarNotification({
    message: message,
    severity: 'success',
  });
}

export function showErrorNotification(message: string) {
  return appActions.updateSnackbarNotification({
    message: message,
    severity: 'error',
  });
}

export function showWarningNotification(message: string) {
  return appActions.updateSnackbarNotification({
    message: message,
    severity: 'warning',
  });
}

export function showInfoNotification(message: string) {
  return appActions.updateSnackbarNotification({
    message: message,
    severity: 'info',
  });
}
