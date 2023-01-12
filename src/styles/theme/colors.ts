import { colors as muiColors, darken } from '@mui/material';

const isaBlue = '#00A099';
const slackmapGreen = '#84B53E';
const slackmapBlue = '#4187C5';

export const appColors = {
  slacklinePoint: slackmapGreen,
  lineStrokeColor: muiColors.red[400],
  guideFeaturesColor: muiColors.orange[400],
  spotFillColor: darken(slackmapGreen, 0.1),
  mainClusterColor: darken(slackmapGreen, 0.2),
  slackmapBlue,
  slackmapGreen,
  isaBlue,
};
