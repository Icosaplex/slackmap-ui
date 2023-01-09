import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

interface Props {}

export const ExtrasPopup = (props: Props) => {
  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="h6"> Description </Typography>
      <Typography variant="body2" color={t => t.palette.text.secondary}>
        axxx
      </Typography>
    </Paper>
  );
};
