import React from 'react';
import { CircularProgress, CircularProgressProps } from '@mui/material';

interface Props extends CircularProgressProps {}
export const LoadingIndicator = (props: Props) => {
  return <CircularProgress {...props} />;
};
