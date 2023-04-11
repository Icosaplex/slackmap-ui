import React from 'react';
import { Box, Typography } from '@mui/material';
import { trimString } from 'utils';

interface Props {
  header: string;
  content?: string;
  skipIfEmpty?: boolean;
  trimLength?: number;
}

export const SlacklineDetailInfoField = (props: Props) => {
  if (props.skipIfEmpty && !props.content) {
    return null;
  }
  return (
    <Box>
      <Typography variant="h6"> {props.header} </Typography>
      <Typography variant="body2" color={t => t.palette.text.secondary}>
        {trimString(props.content, props.trimLength)}
      </Typography>
    </Box>
  );
};
