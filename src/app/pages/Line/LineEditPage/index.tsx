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
import { lineApi } from 'app/api/line-api';
import { LineDetailsForm } from 'app/pages/Create/Line/types';
import { LineEditCard } from 'app/pages/Create/Line/LineEditCard';
import { validateLineFeatures } from 'app/pages/Create/Line/validations';

interface Props {}

export function LineEditPage(props: Props) {
  const { lineId } = useParams();
  const navigate = useNavigate();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [mapErrors, setMapErrors] = useState<string[]>([]);

  const { data: lineGeoJson } = lineApi.useGetLineGeoJsonQuery(lineId!);
  const { data: lineDetails } = lineApi.useGetLineDetailsQuery(lineId!);

  const [updateLine, { isLoading: isSaving, isSuccess: isSavedChanges }] =
    lineApi.useUpdateLineMutation();

  useEffect(() => {
    if (isSavedChanges) {
      navigate({ pathname: `/line/${lineId}` });
    }
  }, [isSavedChanges]);

  useEffect(() => {
    const errors = validateLineFeatures(features);
    if (errors.length > 0) {
      setMapErrors(errors);
      return;
    } else {
      setMapErrors([]);
    }
  }, [features]);

  useEffect(() => {
    if (lineGeoJson) {
      setFeatures(lineGeoJson.features as Feature[]);
    }
  }, [lineGeoJson]);

  const onDrawingFeaturesChanged = (features: Feature[]) => {
    setFeatures(features);
  };

  const onDetailsSubmit = (values: LineDetailsForm) => {
    const geoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };
    updateLine({ id: lineId!, payload: { ...values, geoJson } });
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
        {lineGeoJson && (
          <DrawableMap
            drawControls={{
              polygon: false,
              line_string: true,
              trash: true,
            }}
            onDrawingFeaturesChanged={onDrawingFeaturesChanged}
            drawControlStyles={drawControlStyles('line')}
            drawingFeatures={lineGeoJson.features as Feature[]}
          />
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          height: { xs: 'auto', lg: '100vh' },
        }}
      >
        {lineDetails && (
          <LineEditCard
            mapErrors={mapErrors}
            onSubmit={onDetailsSubmit}
            disableSubmit={features.length === 0 || mapErrors.length > 0}
            isSubmitting={isSaving}
            initialValues={{
              isMeasured: lineDetails.isMeasured || false,
              accessInfo: lineDetails.accessInfo,
              description: lineDetails.description,
              name: lineDetails.name,
              anchorsInfo: lineDetails.anchorsInfo,
              contactInfo: lineDetails.contactInfo,
              extraInfo: lineDetails.extraInfo,
              gearInfo: lineDetails.gearInfo,
              length: lineDetails.length,
              height: lineDetails.height,
              restrictionInfo: lineDetails.restrictionInfo,
              restrictionLevel: lineDetails.restrictionLevel,
              type: lineDetails.type,
            }}
          />
        )}
      </Box>
    </Stack>
  );
}
