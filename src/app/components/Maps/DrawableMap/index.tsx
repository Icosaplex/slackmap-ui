import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Map as ReactMapGL, Source, Layer, ViewState } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import { MapImage } from '../Components/MapImage';
import { layers } from '../layers';
import {
  defaultMapViewState,
  geoJsonURL,
  MAPBOX_TOKEN,
  mapStyles,
} from '../constants';
import { MapLoadingPlaceholder } from '../Components/MapLoadingPlaceholder';
import { DrawControl, MapboxDrawEvent } from './DrawControl';
import { MapboxDrawControls } from '@mapbox/mapbox-gl-draw';
import { centerOfMass, Feature, FeatureCollection, Position } from '@turf/turf';
import { CustomPopup } from '../Components/CustomPopup';
import { ExtrasPopup } from './ExtrasPopup';

const featuresDict = (features: Feature[]) => {
  const dict: Record<string, Feature> = {};
  for (const f of features) {
    if (f.id) {
      dict[f.id] = f;
    }
  }
  return dict;
};

const featuresArray = (features: Record<string, Feature>) => {
  const array: Feature[] = [];
  for (const f of Object.values(features)) {
    if (f.id) {
      array.push(f);
    }
  }
  return array;
};

const featureCollection = (features: Feature[]) => {
  return {
    type: 'FeatureCollection',
    features,
  };
};

interface Props {
  initialViewState?: Partial<ViewState>;
  drawControls: MapboxDrawControls;
  onDrawingFeaturesChanged: (features: Feature[]) => void;
  onSelectionChanged?: (feature?: Feature) => void;
  drawingFeatures: Feature[];
  staticFeatures: Feature[];
  drawControlStyles: object[];
  popup?: {
    component: React.ReactNode;
    position: Position;
    onClose: () => void;
  };
}

export const DrawableMap = (props: Props) => {
  const mapRef = useRef<MapRef>(null);
  const drawRef = React.useRef<MapboxDraw>();

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [cursor, setCursor] = useState('auto');
  const [, setDrawingFeatures] = useState<Feature[]>([]);
  const [, setSelectedFeature] = useState<Feature>();

  const onMapLoad = () => {
    setIsMapLoaded(true);
    mapRef.current?.setPadding({ top: 0, left: 0, bottom: 0, right: 0 });
  };

  useEffect(() => {
    if (props.drawingFeatures?.length > 0) {
      setDrawingFeatures(props.drawingFeatures);

      setTimeout(() => {
        drawRef.current?.set({
          type: 'FeatureCollection',
          features: props.drawingFeatures as any,
        });
      }, 100);
    } else {
      setDrawingFeatures([]);
      drawRef.current?.deleteAll();
    }
  }, [props.drawControls]);

  const onSelectionChange = useCallback(
    (e: MapboxDrawEvent) => {
      if (e.features.length === 1) {
        props.onSelectionChanged?.(e.features[0]);
        return e.features[0];
      } else {
        props.onSelectionChanged?.(undefined);
        return undefined;
      }
    },
    [props.drawControls],
  );

  const onUpdate = useCallback(
    (e: MapboxDrawEvent) => {
      setDrawingFeatures(currentFeatures => {
        const newFeaturesDict = featuresDict(currentFeatures);
        for (const f of e.features) {
          if (f.id) {
            newFeaturesDict[f.id] = f;
          }
        }
        const newFeatures = featuresArray(newFeaturesDict);
        props.onDrawingFeaturesChanged(newFeatures);
        return newFeatures;
      });
    },
    [props.drawControls],
  );

  const onDelete = useCallback(
    (e: MapboxDrawEvent) => {
      setDrawingFeatures(currentFeatures => {
        const newFeaturesDict = featuresDict(currentFeatures);
        for (const f of e.features) {
          if (f.id) {
            delete newFeaturesDict[f.id];
          }
        }
        const newFeatures = featuresArray(newFeaturesDict);
        props.onDrawingFeaturesChanged(newFeatures);
        return newFeatures;
      });
    },
    [props.drawControls],
  );

  return (
    <>
      {!isMapLoaded && <MapLoadingPlaceholder />}
      <ReactMapGL
        initialViewState={props.initialViewState || defaultMapViewState}
        mapStyle={mapStyles.satelliteStreets}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        onLoad={onMapLoad}
        reuseMaps
        ref={mapRef}
        cursor={cursor}
        pitchWithRotate={false}
        maxPitch={0}
        // projection="globe"
      >
        <MapImage name={'marker'} url={'/images/line-marker.png'} />
        {props.popup && (
          <CustomPopup
            longitude={props.popup.position[0]}
            latitude={props.popup.position[1]}
            anchor="bottom-left"
            onClose={() => props.popup?.onClose()}
            maxWidth="none"
          >
            {props.popup.component}
          </CustomPopup>
        )}
        <DrawControl
          ref={drawRef}
          key={JSON.stringify(props.drawControls)}
          displayControlsDefault={false}
          controls={props.drawControls}
          defaultMode="simple_select"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onSelectionChange={onSelectionChange}
          styles={props.drawControlStyles}
        />
        <Source
          id="static"
          type="geojson"
          data={featureCollection(props.staticFeatures) as any}
          generateId
        >
          <Layer {...layers.pointLabel} />
          <Layer {...layers.line} />
          <Layer {...layers.lineLabel} />
          <Layer {...layers.point} />
          <Layer {...layers.polygon} />
          <Layer {...layers.polygonLabel} />
        </Source>
        <Source
          id="world"
          type="geojson"
          data={geoJsonURL.main}
          generateId={true}
        >
          <Layer {...layers.polygonDisabled} />
          <Layer {...layers.lineDisabled} />
          <Layer {...layers.lineLabelDisabled} />
        </Source>
      </ReactMapGL>
    </>
  );
};
