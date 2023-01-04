import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { Stack, SxProps } from '@mui/system';

interface Props {
  loadingText?: string;
  sx?: SxProps;
}
export const LoadingIndicator = (props: Props) => {
  return (
    <Stack
      spacing={1}
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        flex: 1,
        ...props.sx,
      }}
    >
      <CircularProgress />
      <Typography variant="subtitle1" color="primary">
        {props.loadingText || 'Loading'}
      </Typography>
    </Stack>
  );
};
