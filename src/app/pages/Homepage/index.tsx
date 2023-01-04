import React, { useEffect, useState } from 'react';
import { WorldMap } from 'app/components/WorldMap';
import { Box } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mapUrlSearchParams } from 'app/components/WorldMap/mapUtils';
import { Button } from '@mui/material';

interface Props {}

export function Homepage(props: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const onDetailsClick = (id: string, type: MapSlacklineFeatureType) => {
    if (type === 'line') {
      navigate(`/line/${id}`);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
      }}
    >
      {/* <Button></Button> */}
      <WorldMap
        syncMapLocationToUrlParams
        initialViewState={mapUrlSearchParams.parse(searchParams)}
        onDetailsClick={onDetailsClick}
      />
    </Box>
  );
}
