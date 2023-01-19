import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { SpotDetailCard } from './SpotDetailCard';
import { FocusedMap } from 'app/components/Maps/FocusedMap';
import { spotApi } from 'app/api/spot-api';
import { centerOfMass } from '@turf/turf';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { parseMapFeature } from 'app/components/Maps/mapUtils';

interface Props {}

export function SpotDetailPage(props: Props) {
  const { spotId } = useParams();
  const navigate = useNavigate();

  const { data: spotGeoJson, isError } = spotApi.useGetSpotGeoJsonQuery(
    spotId!,
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

  const center = spotGeoJson
    ? centerOfMass(spotGeoJson).geometry.coordinates
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
        <FocusedMap geoJson={spotGeoJson} onFeatureClick={onFeatureClick} />
      </Box>

      <Box
        sx={{
          flex: 1,
          height: { xs: 'auto', lg: '100vh' },
        }}
      >
        {spotId && <SpotDetailCard spotId={spotId} coordinates={center} />}
      </Box>
    </Stack>
  );
}
