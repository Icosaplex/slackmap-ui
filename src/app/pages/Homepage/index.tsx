import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SlacklineMap } from 'app/components/Maps/SlacklineMap';
import { Box } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  mapUrlSearchParams,
  parseMapFeature,
} from 'app/components/Maps/mapUtils';
import { MapboxGeoJSONFeature, ViewStateChangeEvent } from 'react-map-gl';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import AddIcon from '@mui/icons-material/Add';
import PentagonIcon from '@mui/icons-material/Pentagon';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import { useSignInAlert } from 'utils/hooks/useSignInAlert';
import { LineInfoPopup } from 'app/components/Maps/Components/Popups/LineInfoPopup';
import { SpotInfoPopup } from 'app/components/Maps/Components/Popups/SpotInfoPopup';
import { GuideInfoPopup } from 'app/components/Maps/Components/Popups/GuideInfoPopup';
import { useWindowSize } from 'react-use';

interface Props {}

export function Homepage(props: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFeature, setSelectedFeature] = useState<{
    id: string;
    type: MapSlacklineFeatureType;
  }>();

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

  const onSelectedFeatureChange = (feature?: MapboxGeoJSONFeature) => {
    if (!feature) return setSelectedFeature(undefined);

    const { id, type } = parseMapFeature(feature);
    if (id && typeof id === 'string' && type) {
      setSelectedFeature({ id, type: type as MapSlacklineFeatureType });
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

  const Popup = useMemo(() => {
    if (!selectedFeature) return null;

    if (selectedFeature.type === 'line') {
      return (
        <LineInfoPopup
          lineId={selectedFeature.id}
          onDetailsClick={() => {
            navigate(`/line/${selectedFeature.id}`);
          }}
        />
      );
    }

    if (selectedFeature.type === 'spot') {
      return (
        <SpotInfoPopup
          spotId={selectedFeature.id}
          onDetailsClick={() => {
            navigate(`/spot/${selectedFeature.id}`);
          }}
        />
      );
    }

    if (selectedFeature.type === 'guide') {
      return (
        <GuideInfoPopup
          guideId={selectedFeature.id}
          onDetailsClick={() => {
            navigate(`/guide/${selectedFeature.id}`);
          }}
        />
      );
    }

    return null;
  }, [navigate, selectedFeature]);

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
          tooltipTitle={'Add a new access guide'}
          onClick={onAddGuideClick}
          sx={{
            color: t => t.palette.primary.main,
          }}
        />
      </SpeedDial>

      {/* <Button></Button> */}
      <SlacklineMap
        onSelectedFeatureChange={onSelectedFeatureChange}
        onMapMoveEnd={onMapMoveEnd}
        initialViewState={mapUrlSearchParams.parse(searchParams)}
        popup={Popup}
      />
    </Box>
  );
}
