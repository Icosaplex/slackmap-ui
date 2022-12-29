import * as React from 'react';
import { Map } from 'app/components/Map';
import { Box } from '@mui/system';

interface Props {}

export function Homepage(props: Props) {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Map />
    </Box>
  );
}
