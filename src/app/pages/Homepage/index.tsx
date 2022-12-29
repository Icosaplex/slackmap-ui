import React, { useEffect, useState } from 'react';
import { Map } from 'app/components/Map';
import { Box } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mapUrlSearchParams } from 'app/components/Map/mapUtils';
import { MapboxGeoJSONFeature } from 'react-map-gl';
import { MapSlacklineFeatureType } from 'app/components/Map/types';

interface Props {}

export function Homepage(props: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleFeatureClick = (
    feature: MapboxGeoJSONFeature,
    type: MapSlacklineFeatureType,
    id: string,
  ) => {
    navigate(`/${type}/${id}`);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Map
        syncMapLocationToUrlParams
        initialViewState={mapUrlSearchParams.parse(searchParams)}
        onFeatureClick={handleFeatureClick}
      />
    </Box>
  );
}
