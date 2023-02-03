import { createTheme, responsiveFontSizes } from '@mui/material';

import { palette } from './palette';

export const theme = responsiveFontSizes(
  createTheme({
    palette: palette,
    typography: {
      fontFamily: 'Inter',
    },
  }),
);
