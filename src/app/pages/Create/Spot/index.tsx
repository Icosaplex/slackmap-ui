import React, { useCallback, useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DrawableMap } from 'app/components/Maps/DrawableMap';
import { mapUrlSearchParams } from 'app/components/Maps/mapUtils';
import { SpotEditCard } from './SpotEditCard';
import { MapboxDrawControls } from '@mapbox/mapbox-gl-draw';
import { Feature, FeatureCollection, Position } from 'geojson';
import { validateSpotFeatures } from './validations';
import { showErrorNotification, showInfoNotification } from 'utils';
import { useDispatch } from 'react-redux';
import { drawControlStyles } from 'app/components/Maps/DrawableMap/DrawControl/styles';
import { SpotDetailsForm } from './types';
import { spotApi } from 'app/api/spot-api';

interface Props {}

export function CreateSpotPage(props: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [mapErrors, setMapErrors] = useState<string[]>([]);

  const [createSpot, { isLoading: isSaving, isSuccess: isSavedChanges }] =
    spotApi.useCreateSpotMutation();

  useEffect(() => {
    if (isSavedChanges) {
      navigate({ pathname: '/', search: searchParams.toString() });
    }
  }, [isSavedChanges]);

  useEffect(() => {
    const errors = validateSpotFeatures(features);
    if (errors.length > 0) {
      setMapErrors(errors);
      return;
    } else {
      setMapErrors([]);
    }
  }, [features]);

  const onDrawingFeaturesChanged = (features: Feature[]) => {
    setFeatures(features);
  };

  const onDetailsSubmit = (values: SpotDetailsForm) => {
    const geoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };
    createSpot({ ...values, geoJson });
  };
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
        <DrawableMap
          initialViewState={mapUrlSearchParams.parse(searchParams)}
          drawControls={{
            polygon: true,
            line_string: false,
            trash: true,
          }}
          onDrawingFeaturesChanged={onDrawingFeaturesChanged}
          drawControlStyles={drawControlStyles('spot')}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          height: { xs: 'auto', lg: '100vh' },
        }}
      >
        <SpotEditCard
          mapErrors={mapErrors}
          onSubmit={onDetailsSubmit}
          disableSubmit={features.length === 0 || mapErrors.length > 0}
          isSubmitting={isSaving}
        />
      </Box>
    </Stack>
  );
}
