import React, { useEffect, useState } from 'react';
import { WorldMap } from 'app/components/Maps/WorldMap';
import { Box } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  cachePointsGeoJson,
  mapUrlSearchParams,
} from 'app/components/Maps/mapUtils';
import { ViewStateChangeEvent } from 'react-map-gl';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import AddIcon from '@mui/icons-material/Add';
import PentagonIcon from '@mui/icons-material/Pentagon';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import { useSignInAlert } from 'utils/hooks/useSignInAlert';

interface Props {}

export function Homepage(props: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const checkUserSignIn = useSignInAlert();

  const onAddSpotClick = async () => {
    const signedIn = await checkUserSignIn();
    if (signedIn) {
      navigate({ pathname: '/create/spot', search: searchParams.toString() });
    }
  };

  const onAddLineClick = async () => {
    const signedIn = await checkUserSignIn();
    if (signedIn) {
      navigate({ pathname: '/create/line', search: searchParams.toString() });
    }
  };

  const onAddGuideClick = async () => {
    const signedIn = await checkUserSignIn();
    if (signedIn) {
      navigate({ pathname: '/create/guide', search: searchParams.toString() });
    }
  };

  const onDetailsClick = (id: string, type: MapSlacklineFeatureType) => {
    if (type === 'line') {
      navigate(`/line/${id}`);
    } else if (type === 'spot') {
      navigate(`/spot/${id}`);
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
        height: '100%',
        width: '100%',
      }}
    >
      <SpeedDial
        sx={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
        }}
        icon={<AddIcon />}
        ariaLabel={'speed dial'}
      >
        <SpeedDialAction
          icon={<LinearScaleIcon />}
          tooltipTitle={'Add a new line'}
          onClick={onAddLineClick}
          sx={{
            color: t => t.palette.primary.main,
          }}
        />
        <SpeedDialAction
          icon={<PentagonIcon />}
          tooltipTitle={'Add a new spot'}
          onClick={onAddSpotClick}
          sx={{
            color: t => t.palette.primary.main,
          }}
        />
        <SpeedDialAction
          icon={<FollowTheSignsIcon />}
          tooltipTitle={'Add a new guide'}
          onClick={onAddGuideClick}
          sx={{
            color: t => t.palette.primary.main,
          }}
        />
      </SpeedDial>

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
