import React from 'react';
import { Alert, AlertColor, AlertTitle, Box, Typography } from '@mui/material';

interface Props {
  level: SlacklineRestrictionLevel;
  restrictionInfo?: string;
}

export const SlacklineDetailRestrictionField = (props: Props) => {
  let severity: AlertColor | undefined;
  let warningText: string | undefined;
  switch (props.level) {
    case 'partial':
      severity = 'info';
      warningText = 'Partially Restricted Access';
      break;
    case 'full':
      severity = 'warning';
      warningText = 'FULLY Restricted Access';

      break;
    default:
      break;
  }
  if (!severity) {
    return null;
  }
  return (
    <Box>
      <Alert severity={severity}>
        <AlertTitle>Warning - {warningText}</AlertTitle>
        {props.restrictionInfo}
      </Alert>
    </Box>
  );
};
