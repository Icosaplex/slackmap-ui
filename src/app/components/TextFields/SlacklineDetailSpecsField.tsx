import React from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';

interface Props {
  header: string;
  content: { label: string; value: string }[];
  isAccurate?: boolean;
}

export const SlacklineDetailSpecsField = (props: Props) => {
  return (
    <Box>
      <Stack direction={'row'} alignItems="center" spacing={1}>
        <Typography variant="h6"> {props.header} </Typography>
        {props.isAccurate ? (
          <Tooltip
            title="The specs are marked as measured!"
            enterTouchDelay={0}
          >
            <CheckCircleIcon color="primary" />
          </Tooltip>
        ) : (
          <Tooltip
            title="The specs are NOT marked as measured. They might be NOT accurate!"
            enterTouchDelay={0}
          >
            <HelpIcon color="primary" />
          </Tooltip>
        )}
      </Stack>
      {props.content.map(c => (
        <Typography
          key={c.label}
          variant="body2"
          color={t => t.palette.text.secondary}
        >
          {c.label}: <b>{c.value}</b>
        </Typography>
      ))}
    </Box>
  );
};
