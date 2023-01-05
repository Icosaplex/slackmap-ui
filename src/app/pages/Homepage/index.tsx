import React, { useEffect, useState } from 'react';
import { WorldMap } from 'app/components/WorldMap';
import { Box } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mapUrlSearchParams } from 'app/components/WorldMap/mapUtils';
import { Button } from '@mui/material';
import { ViewStateChangeEvent } from 'react-map-gl';

interface Props {}

export function Homepage(props: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const onDetailsClick = (id: string, type: MapSlacklineFeatureType) => {
    if (type === 'line') {
      navigate(`/line/${id}`);
    }
  };
  const onMapMoveEnd = (event: ViewStateChangeEvent) => {
    const { longitude, latitude, zoom } = event.viewState;
    searchParams.set(
      'map',
      mapUrlSearchParams.stringify(longitude, latitude, zoom),
    );
    setSearchParams(searchParams, { replace: true });
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
        onPopupDetailsClick={onDetailsClick}
        onMapMoveEnd={onMapMoveEnd}
        initialViewState={mapUrlSearchParams.parse(searchParams)}
        showInfoPopup
        zoomToUserLocation
      />
    </Box>
  );
}
