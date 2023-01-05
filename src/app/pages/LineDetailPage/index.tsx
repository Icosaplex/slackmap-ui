import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { lineApi } from 'app/api/line-api';
import { LineDetailCard } from './LineDetailCard';
import { FocusedMap } from 'app/components/Map/FocusedMap';

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
          flex: 1,
          height: isDesktop ? '100vh' : 'auto',
        }}
      >
        {lineId && <LineDetailCard lineId={lineId} />}
      </Box>
    </Stack>
  );
}
