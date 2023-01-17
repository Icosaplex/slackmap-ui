import React from 'react';
import { Alert, AlertColor, AlertTitle, Box, Typography } from '@mui/material';

interface Props {
  updatedDate: string;
}

export const OutdatedInfoField = (props: Props) => {
  const now = new Date();
  const daysAgo = new Date(now.getTime());
  daysAgo.setDate(now.getDate() - 730);

  if (!props.updatedDate || new Date(props.updatedDate) > daysAgo) {
    return null;
  }

  return (
    <Box>
      <Alert severity={'warning'}>
        The last update on this was more than 2 years ago. The information might
        be outdated!
      </Alert>
    </Box>
  );
};
