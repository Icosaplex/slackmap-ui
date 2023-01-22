import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { FocusedMap } from 'app/components/Maps/FocusedMap';
import { centerOfMass } from '@turf/turf';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { parseMapFeature } from 'app/components/Maps/mapUtils';
import { guideApi } from 'app/api/guide-api';
import { GuideDetailCard } from './GuideDetailCard';

interface Props {}

export function GuideDetailPage(props: Props) {
  const { guideId } = useParams();
  const navigate = useNavigate();

  const { data: guideGeoJson, isError } = guideApi.useGetGuideGeoJsonQuery(
    guideId!,
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
      if (type === 'guide') {
        navigate(`/guide/${id}`);
      }
    }
  };

  const center = guideGeoJson
    ? centerOfMass(guideGeoJson).geometry.coordinates
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
        <FocusedMap geoJson={guideGeoJson} onFeatureClick={onFeatureClick} />
      </Box>

      <Box
        sx={{
          flex: 1,
          height: { xs: 'auto', lg: '100vh' },
        }}
      >
        {guideId && <GuideDetailCard guideId={guideId} coordinates={center} />}
      </Box>
    </Stack>
  );
}
