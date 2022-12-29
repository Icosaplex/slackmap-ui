import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  header: string;
  content?: string;
  skipIfEmpty?: boolean;
}

export const SlacklineDetailInfoField = (props: Props) => {
  if (props.skipIfEmpty && !props.content) {
    return null;
  }
  return (
    <Box>
      <Typography variant="h6"> {props.header} </Typography>
      <Typography variant="body2" color={t => t.palette.text.secondary}>
        {props.content}
      </Typography>
    </Box>
  );
};
