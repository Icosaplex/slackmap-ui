import React, { useEffect, useState } from 'react';
import { Map } from 'app/components/Map';
import { Box, Stack } from '@mui/system';
import { useParams, useSearchParams } from 'react-router-dom';
import { mapUrlSearchParams } from 'app/components/Map/mapUtils';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { lineApi } from 'app/api/line-api';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { LineDetailCard } from './LineDetailCard';

interface Props {}

export function LineDetailPage(props: Props) {
  const { lineId } = useParams();
  const { isDesktop } = useMediaQuery();

  return (
    <Stack
      direction={isDesktop ? 'row' : 'column'}
      sx={{
        minHeight: '100%',
      }}
    >
      <Box
        sx={{
          height: isDesktop ? '100vh' : '33vh',
          width: isDesktop ? '67%' : '100%',
        }}
      >
        <Map featureIdToFocus={lineId} />
      </Box>

      <Box
        sx={{
          // display: 'flex',
          flex: 1,
          height: isDesktop ? '100vh' : 'auto',
          // overflow: 'scroll',
        }}
      >
        {lineId && <LineDetailCard lineId={lineId} />}
      </Box>
    </Stack>
  );
}
