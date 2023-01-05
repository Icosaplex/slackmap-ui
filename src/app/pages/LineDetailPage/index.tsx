import React, { useEffect, useState } from 'react';
import { WorldMap } from 'app/components/WorldMap';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { mapUrlSearchParams } from 'app/components/WorldMap/mapUtils';
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
import { FocusedMap } from 'app/components/FocusedMap';

interface Props {}

export function LineDetailPage(props: Props) {
  const { lineId } = useParams();
  const { isDesktop } = useMediaQuery();
  const navigate = useNavigate();

  const { data: lineGeoJson, isFetching } = lineApi.useGetLineGeoJsonQuery(
    lineId!,
  );

  const onFeatureClick = (id: string, type: MapSlacklineFeatureType) => {
    if (type === 'line') {
      navigate(`/line/${id}`);
    }
  };

  return (
    <Stack
      direction={isDesktop ? 'row' : 'column'}
      sx={{
        minHeight: '100%',
      }}
    >
      <Box
        sx={{
          height: isDesktop ? '100vh' : '50vh',
          width: isDesktop ? '67%' : '100%',
          position: 'relative',
        }}
      >
        <FocusedMap geoJson={lineGeoJson} onFeatureClick={onFeatureClick} />
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
