import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Map as ReactMapGL, Source, Layer, ViewState } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import { MapImage } from '../Components/MapImage';
import {
  defaultMapViewState,
  geoJsonURL,
  MAPBOX_TOKEN,
  mapStyles,
} from '../constants';
import { MapLoadingPlaceholder } from '../Components/MapLoadingPlaceholder';
import { DrawControl, MapboxDrawEvent } from './DrawControl';
import { MapboxDrawControls } from '@mapbox/mapbox-gl-draw';
import { Feature, FeatureCollection } from 'geojson';
import { MapSources } from '../sources';
import { calculateBounds } from '../mapUtils';

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

const featureCollection = (features: Feature[]): FeatureCollection => {
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
  drawingFeatures?: Feature[];
  drawControlStyles: object[];
}

export const DrawableMap = (props: Props) => {
  const mapRef = useRef<MapRef>(null);
  const drawRef = React.useRef<MapboxDraw>();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const fitMapToCurrentGeoJson = useCallback(
    (opts: { animate?: boolean } = {}) => {
      if (!isMapLoaded || !props.drawingFeatures || !mapRef.current) return;
      const map = mapRef.current;

      const { marginedBounds } = calculateBounds(
        featureCollection(props.drawingFeatures),
        parseFloat(props.drawingFeatures[0].properties?.l),
      );
      map.fitBounds(marginedBounds, { animate: false });
    },
    [isMapLoaded, props.drawingFeatures],
  );

  const onMapLoad = () => {
    setIsMapLoaded(true);
    mapRef.current?.setPadding({ top: 0, left: 0, bottom: 0, right: 0 });
  };

  useEffect(() => {
    if (!isMapLoaded || !props.drawingFeatures || !mapRef.current) return;
    fitMapToCurrentGeoJson();

    const features = props.drawingFeatures.map(f => {
      return {
        ...f,
        id: (Math.random() + 1).toString(36).substring(5),
      };
    });
    if (props.drawingFeatures?.length > 0 && drawRef.current) {
      const dict = featuresDict(features);
      const currentFeatures = drawRef.current?.getAll();
      for (const feature of currentFeatures?.features || []) {
        if (feature.id) {
          dict[feature.id] = feature;
        }
      }
      setTimeout(() => {
        drawRef.current?.set(featureCollection(featuresArray(dict)));
      }, 100);
    } else {
      drawRef.current?.deleteAll();
    }
  }, [isMapLoaded, props.drawingFeatures]);

  const onUpdate = useCallback((e: MapboxDrawEvent) => {
    const currentFeatures = drawRef.current?.getAll();
    props.onDrawingFeaturesChanged(currentFeatures?.features || []);
  }, []);

  const onDelete = useCallback((e: MapboxDrawEvent) => {
    const currentFeatures = drawRef.current?.getAll();
    props.onDrawingFeaturesChanged(currentFeatures?.features || []);
  }, []);

  return (
    <>
      {!isMapLoaded && <MapLoadingPlaceholder />}
      <ReactMapGL
        initialViewState={props.initialViewState || defaultMapViewState}
        mapStyle={mapStyles.satelliteStreets}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        onLoad={onMapLoad}
        ref={mapRef}
        pitchWithRotate={false}
        maxPitch={0}
      >
        <MapImage name={'marker'} url={'/images/line-marker.png'} />
        {isMapLoaded && (
          <DrawControl
            ref={drawRef}
            displayControlsDefault={false}
            controls={props.drawControls}
            defaultMode="simple_select"
            onCreate={onUpdate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            styles={props.drawControlStyles}
          />
        )}
        <MapSources
          options={{ lines: true, guides: true, spots: true }}
          filterId={(props.drawingFeatures || [])[0]?.properties?.id}
        />
      </ReactMapGL>
    </>
  );
};
