import { Box, Typography } from '@mui/material';
import React from 'react';

export const MapLoadingPlaceholder = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        backgroundColor: theme => theme.palette.background.paper,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 10,
      }}
    >
      <img
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        src={'/images/slackmapLogo.png'}
        alt=""
      />
      <Typography variant="h6" sx={{ color: t => t.palette.text.secondary }}>
        Loading Map...
      </Typography>
    </Box>
  );
};
