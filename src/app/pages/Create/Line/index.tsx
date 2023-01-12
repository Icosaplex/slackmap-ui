import React, { useCallback, useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DrawableMap } from 'app/components/Maps/DrawableMap';
import { mapUrlSearchParams } from 'app/components/Maps/mapUtils';
import { LineEditCard } from './LineEditCard';
import { MapboxDrawControls } from '@mapbox/mapbox-gl-draw';
import { Feature, FeatureCollection, Position } from 'geojson';
import { validateLineFeatures } from './validations';
import { showErrorNotification, showInfoNotification } from 'utils';
import { useDispatch } from 'react-redux';
import { drawControlStyles } from 'app/components/Maps/DrawableMap/DrawControl/styles';
import { ExtrasPopup } from 'app/components/Maps/DrawableMap/ExtrasPopup';
import { LineDetailsForm } from './types';
import { lineApi } from 'app/api/line-api';

interface Props {}

export function CreateLinePage(props: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [mapErrors, setMapErrors] = useState<string[]>([]);

  const [createLine, { isLoading: isSaving, isSuccess: isSavedChanges }] =
    lineApi.useCreateLineMutation();

  useEffect(() => {
    if (isSavedChanges) {
      navigate({ pathname: '/', search: searchParams.toString() });
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

  const onDrawingFeaturesChanged = (features: Feature[]) => {
    setFeatures(features);
  };

  const onDetailsSubmit = (values: LineDetailsForm) => {
    const geoJson: FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };
    createLine({ ...values, geoJson });
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
            polygon: false,
            line_string: true,
            trash: true,
          }}
          onDrawingFeaturesChanged={onDrawingFeaturesChanged}
          drawControlStyles={drawControlStyles('line')}
          // onSelectionChanged={onSelectionChanged}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          height: { xs: 'auto', lg: '100vh' },
        }}
      >
        <LineEditCard
          mapErrors={mapErrors}
          onSubmit={onDetailsSubmit}
          disableSubmit={features.length === 0 || mapErrors.length > 0}
          isSubmitting={isSaving}
        />
      </Box>
    </Stack>
  );
}
