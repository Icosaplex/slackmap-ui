import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WorldMap } from 'app/components/Maps/WorldMap';
import { Box } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mapUrlSearchParams } from 'app/components/Maps/mapUtils';
import { MapboxGeoJSONFeature, ViewStateChangeEvent } from 'react-map-gl';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import AddIcon from '@mui/icons-material/Add';
import PentagonIcon from '@mui/icons-material/Pentagon';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import { useSignInAlert } from 'utils/hooks/useSignInAlert';
import { LineInfoPopup } from 'app/components/Maps/Components/Popups/LineInfoPopup';
import { CommunityMap } from 'app/components/Maps/CommunityMap';
import { CommunityInfoPopup } from 'app/components/Maps/Components/Popups/CommunityInfoPopup';

interface Props {}

export function CommunitiesPage(props: Props) {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>();
  const navigate = useNavigate();

  const onSelectedFeatureChange = (feature?: MapboxGeoJSONFeature) => {
    if (!feature) return setSelectedFeatureId(undefined);
    setSelectedFeatureId(feature.properties?.id);
  };

  const Popup = useMemo(() => {
    if (!selectedFeatureId) return null;

    return <CommunityInfoPopup id={selectedFeatureId} />;
  }, [navigate, selectedFeatureId]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      <CommunityMap
        onSelectedFeatureChange={onSelectedFeatureChange}
        popup={Popup}
      />
    </Box>
  );
}
