import React, { useCallback, useEffect, useState } from 'react';
import { Box, Stack } from '@mui/system';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DrawableMap } from 'app/components/Maps/DrawableMap';
import { mapUrlSearchParams } from 'app/components/Maps/mapUtils';
import { DrawingMode, LineEditCard } from './LineEditCard';
import { MapboxDrawControls } from '@mapbox/mapbox-gl-draw';
import { centerOfMass, Feature, Position } from '@turf/turf';
import { validateLineFeatures } from './validations';
import { showErrorNotification } from 'utils';
import { useDispatch } from 'react-redux';
import { drawControlStyles } from 'app/components/Maps/DrawableMap/DrawControl/styles';
import { ExtrasPopup } from 'app/components/Maps/DrawableMap/ExtrasPopup';

interface Props {}

export function CreateLinePage(props: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [drawingMode, setDrawingMode] = React.useState<DrawingMode>('line');
  const [drawControls, setDrawControls] = useState<MapboxDrawControls>({
    polygon: false,
    line_string: true,
    trash: true,
  });
  const [lineFeatures, setLineFeatures] = useState<Feature[]>([]);
  const [extraFeatures, setExtraFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature>();

  const [mapErrors, setMapErrors] = useState<string[]>([]);
  const [popup, setPopup] = useState<{
    feature: Feature;
    position: Position;
  }>();

  useEffect(() => {
    if (drawingMode === 'extras') {
      setDrawControls({
        polygon: true,
        line_string: true,
        point: true,
        trash: true,
      });
    } else {
      setDrawControls({
        line_string: true,
        point: false,
        trash: true,
      });
    }
  }, [drawingMode]);

  useEffect(() => {
    const errors = validateLineFeatures(lineFeatures);
    if (errors.length > 0) {
      setMapErrors(errors);
      return;
    } else {
      setMapErrors([]);
    }
  }, [lineFeatures]);

  useEffect(() => {
    if (selectedFeature) {
      const extraFeature = extraFeatures.find(f => f.id === selectedFeature.id);
      if (extraFeature) {
        const center = centerOfMass(extraFeature).geometry.coordinates;
        // setPopup({
        //   feature: extraFeature,
        //   position: center,
        // });
      }
    } else {
      setPopup(undefined);
    }
  }, [extraFeatures, selectedFeature]);

  const onDrawingFeaturesChanged = (features: Feature[]) => {
    if (drawingMode === 'line') {
      setLineFeatures(features);
    }
    if (drawingMode === 'extras') {
      for (const feature of features) {
        feature.properties = feature.properties || {};
        feature.properties['ft'] = 'extra';
        if (!feature.properties['l']) {
          feature.properties['l'] = feature.id?.toString().substring(0, 4);
        }
      }
      setExtraFeatures(features);
    }
  };

  const onDrawingModeChange = (mode: DrawingMode) => {
    console.log(lineFeatures, extraFeatures);
    setDrawingMode(mode);
  };

  const onSelectionChanged = (feature?: Feature) => {
    setSelectedFeature(feature);
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
          drawControls={drawControls}
          onDrawingFeaturesChanged={onDrawingFeaturesChanged}
          drawingFeatures={
            drawingMode === 'line' ? lineFeatures : extraFeatures
          }
          staticFeatures={drawingMode === 'line' ? extraFeatures : lineFeatures}
          drawControlStyles={drawControlStyles(drawingMode === 'extras')}
          onSelectionChanged={onSelectionChanged}
          popup={
            popup && {
              component: <ExtrasPopup />,
              position: popup.position,
              onClose: () => setPopup(undefined),
            }
          }
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          height: { xs: 'auto', lg: '100vh' },
        }}
      >
        <LineEditCard
          mode="create"
          drawingMode={drawingMode}
          onDrawingModeChange={onDrawingModeChange}
          mapErrors={mapErrors}
        />
      </Box>
    </Stack>
  );
}
