import React from 'react';
import { SnackbarNotification } from 'app/slices/app/types';
import { Alert, Snackbar } from '@mui/material';

interface Props {
  snackbarNotification: SnackbarNotification;
  onClose: (event) => void;
}
const NotificationSnackbar = ({ snackbarNotification, onClose }: Props) => {
  const isOpen = Boolean(snackbarNotification);
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={isOpen}
      autoHideDuration={snackbarNotification?.duration ?? 3000}
      onClose={onClose}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={snackbarNotification?.severity}
      >
        {snackbarNotification?.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
