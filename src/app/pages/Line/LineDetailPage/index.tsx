import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { lineApi } from 'app/api/line-api';
import { LineDetailCard } from './LineDetailCard';
import { FocusedMap } from 'app/components/Maps/FocusedMap';
import { centerOfMass } from '@turf/turf';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { parseMapFeature } from 'app/components/Maps/mapUtils';

interface Props {}

export function LineDetailPage(props: Props) {
  const { lineId } = useParams();
  const navigate = useNavigate();

  const { data: lineGeoJson, isError } = lineApi.useGetLineGeoJsonQuery(
    lineId!,
  );

  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError]);

  const onFeatureClick = (feature: MapboxGeoJSONFeature) => {
    const { id, type } = parseMapFeature(feature);
    if (id && typeof id === 'string' && type) {
      if (type === 'line') {
        navigate(`/line/${id}`);
      }
      if (type === 'spot') {
        navigate(`/spot/${id}`);
      }
    }
  };

  const center = lineGeoJson
    ? centerOfMass(lineGeoJson).geometry.coordinates
    : undefined;

  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      sx={{
        minHeight: '100%',
      }}
    >
      <Box
        sx={{
          height: { xs: '50vh', lg: '100vh' },
          width: { xs: '100%', lg: '67%' },
          position: 'relative',
        }}
      >
        <FocusedMap geoJson={lineGeoJson} onFeatureClick={onFeatureClick} />
      </Box>

      <Box
        sx={{
          flex: 1,
          height: { xs: 'auto', lg: '100vh' },
        }}
      >
        {lineId && <LineDetailCard lineId={lineId} coordinates={center} />}
      </Box>
    </Stack>
  );
}
