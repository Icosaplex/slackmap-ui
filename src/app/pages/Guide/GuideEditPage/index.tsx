import React, {  useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams, } from 'react-router-dom';
import { DrawableMap } from 'app/components/Maps/DrawableMap';
import { Feature, FeatureCollection, Position } from 'geojson';
import { drawControlStyles } from 'app/components/Maps/DrawableMap/DrawControl/styles';
import { guideApi } from 'app/api/guide-api';
import { validateGuideFeatures } from 'app/pages/Create/Guide/validations';
import { GuideDetailsForm } from 'app/pages/Create/Guide/types';
import { GuideEditCard } from 'app/pages/Create/Guide/GuideEditCard';

interface Props {}

export function GuideEditPage(props: Props) {
  const { guideId } = useParams();
  const navigate = useNavigate();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [mapErrors, setMapErrors] = useState<string[]>([]);

  const { data: guideGeoJson } = guideApi.useGetGuideGeoJsonQuery(guideId!);
  const { data: guideDetails } = guideApi.useGetGuideDetailsQuery(guideId!);

  const [updateGuide, { isLoading: isSaving, isSuccess: isSavedChanges }] =
    guideApi.useUpdateGuideMutation();

  useEffect(() => {
    if (isSavedChanges) {
      navigate({ pathname: `/guide/${guideId}` });
    }
  }, [isSavedChanges]);

  useEffect(() => {
    const errors = validateGuideFeatures(features);
    if (errors.length > 0) {
      setMapErrors(errors);
      return;
    } else {
      setMapErrors([]);
    }
  }, [features]);

  useEffect(() => {
    if (guideGeoJson) {
      setFeatures(guideGeoJson.features as Feature[]);
    }
  }, [guideGeoJson]);

  const onDrawingFeaturesChanged = (features: Feature[]) => {
    setFeatures(features);
  };

  const onDetailsSubmit = (values: GuideDetailsForm) => {
    const geoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };
    updateGuide({ id: guideId!, payload: { ...values, geoJson } });
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
        {guideGeoJson && (
          <DrawableMap
            drawControls={{
              point: true,
              polygon: true,
              line_string: true,
              trash: true,
            }}
            onDrawingFeaturesChanged={onDrawingFeaturesChanged}
            drawControlStyles={drawControlStyles('guide')}
            drawingFeatures={guideGeoJson.features as Feature[]}
          />
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          height: { xs: 'auto', lg: '100vh' },
        }}
      >
        {guideDetails && (
          <GuideEditCard
            mapErrors={mapErrors}
            onSubmit={onDetailsSubmit}
            disableSubmit={features.length === 0 || mapErrors.length > 0}
            isSubmitting={isSaving}
            initialValues={{
              description: guideDetails.description,
              type: guideDetails.type,
              images: guideDetails.images,
            }}
          />
        )}
      </Box>
    </Stack>
  );
}
