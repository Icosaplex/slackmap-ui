import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface Props {
  label: string;
}

export const StandardInputTextField = (props: Props) => {
  const { label } = props;
  return (
    <Box>
      <TextField label={label} variant="outlined" />
    </Box>
  );
};
