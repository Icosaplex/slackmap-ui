import React, { useCallback, useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DrawableMap } from 'app/components/Maps/DrawableMap';
import { mapUrlSearchParams } from 'app/components/Maps/mapUtils';
import { MapboxDrawControls } from '@mapbox/mapbox-gl-draw';
import { Feature, FeatureCollection, Position } from 'geojson';
import { showErrorNotification, showInfoNotification } from 'utils';
import { useDispatch } from 'react-redux';
import { drawControlStyles } from 'app/components/Maps/DrawableMap/DrawControl/styles';
import { spotApi } from 'app/api/spot-api';
import { validateSpotFeatures } from 'app/pages/Create/Spot/validations';
import { SpotDetailsForm } from 'app/pages/Create/Spot/types';
import { SpotEditCard } from 'app/pages/Create/Spot/SpotEditCard';

interface Props {}

export function SpotEditPage(props: Props) {
  const { spotId } = useParams();
  const navigate = useNavigate();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [mapErrors, setMapErrors] = useState<string[]>([]);

  const { data: spotGeoJson } = spotApi.useGetSpotGeoJsonQuery(spotId!);
  const { data: spotDetails } = spotApi.useGetSpotDetailsQuery(spotId!);

  const [updateSpot, { isLoading: isSaving, isSuccess: isSavedChanges }] =
    spotApi.useUpdateSpotMutation();

  useEffect(() => {
    if (isSavedChanges) {
      navigate({ pathname: `/spot/${spotId}` });
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

  useEffect(() => {
    if (spotGeoJson) {
      setFeatures(spotGeoJson.features as Feature[]);
    }
  }, [spotGeoJson]);

  const onDrawingFeaturesChanged = (features: Feature[]) => {
    setFeatures(features);
  };

  const onDetailsSubmit = (values: SpotDetailsForm) => {
    const geoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };
    updateSpot({ id: spotId!, payload: { ...values, geoJson } });
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
        {spotGeoJson && (
          <DrawableMap
            drawControls={{
              polygon: true,
              line_string: false,
              trash: true,
            }}
            onDrawingFeaturesChanged={onDrawingFeaturesChanged}
            drawControlStyles={drawControlStyles('spot')}
            drawingFeatures={spotGeoJson.features as Feature[]}
          />
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          height: { xs: 'auto', lg: '100vh' },
        }}
      >
        {spotDetails && (
          <SpotEditCard
            mapErrors={mapErrors}
            onSubmit={onDetailsSubmit}
            disableSubmit={features.length === 0 || mapErrors.length > 0}
            isSubmitting={isSaving}
            initialValues={{
              accessInfo: spotDetails.accessInfo,
              description: spotDetails.description,
              name: spotDetails.name,
              contactInfo: spotDetails.contactInfo,
              extraInfo: spotDetails.extraInfo,
              restrictionInfo: spotDetails.restrictionInfo,
              restrictionLevel: spotDetails.restrictionLevel,
              images: spotDetails.images,
            }}
          />
        )}
      </Box>
    </Stack>
  );
}
