import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Map as ReactMapGL,
  Source,
  Layer,
  MapLayerMouseEvent,
  ScaleControl,
  MapboxGeoJSONFeature,
  ViewStateChangeEvent,
} from 'react-map-gl';
import type { Position } from 'geojson';
import type { MapRef } from 'react-map-gl';
import {
  lineLabelLayer,
  lineLayer,
  polygonLayer,
  lineLayerFocused,
  lineLabelLayerFocused,
  polygonLayerFocused,
} from './layers';
import MapImage from '../WorldMap/MapImage';
import mapboxgl, {
  LngLatBoundsLike,
  MapBoxZoomEvent,
  MapSourceDataEvent,
} from 'mapbox-gl';
import * as turf from '@turf/turf';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { Skeleton } from '@mui/material';

// FIX: https://github.com/visgl/react-map-gl/issues/1266
// @ts-ignore
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
interface Props {
  geoJson?: any;
}

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const defaultMapState = {
  latitude: 35.92263245263329,
  longitude: -39.41644394307363,
  zoom: 1,
  bearing: 0,
  pitch: 0,
};

export const FocusedMap = (props: Props) => {
  const mapRef = useRef<MapRef>(null);
  const { isDesktop } = useMediaQuery();

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [viewState, setViewState] = useState(defaultMapState);
  const [enableStricMap, setEnableStrictMap] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const onMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  const moveMapTo = (position: Position) => {
    const map = mapRef.current?.getMap();
    map?.flyTo({
      center: [position[0], position[1]],
      duration: 300,
    });
  };

  useEffect(() => {
    if (!isMapLoaded || !props.geoJson || !mapRef.current) return;

    const map = mapRef.current.getMap();
    const bounds = turf.bbox(props.geoJson) as [number, number, number, number];
    setEnableStrictMap(true);
    map.fitBounds(bounds, {
      padding: isDesktop ? 100 : 50,
      animate: false,
    });
    setIsMapReady(true);
  }, [isDesktop, isMapLoaded, props.geoJson]);

  const onMove = (event: ViewStateChangeEvent) => {
    if (!isMapLoaded || !mapRef.current) return;

    if (enableStricMap && props.geoJson) {
      const center = turf.centerOfMass(props.geoJson).geometry.coordinates;
      setViewState({
        latitude: center[1],
        longitude: center[0],
        zoom: event.viewState.zoom,
        bearing: 0,
        pitch: 0,
      });
    } else {
      setViewState(event.viewState);
    }
  };

  return (
    <>
      {!isMapReady && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundColor: 'grey.600',
          }}
        />
      )}
      <ReactMapGL
        {...viewState}
        mapStyle={'mapbox://styles/mapbox/satellite-streets-v11'}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        onLoad={onMapLoad}
        reuseMaps
        ref={mapRef}
        dragPan={false}
        onMove={onMove}
        projection="globe"
      >
        <ScaleControl />
        <MapImage name={'marker'} url={'/images/line-marker.png'} />
        <Source
          id="world"
          type="geojson"
          data="https://d1hbfm0s717r1n.cloudfront.net/geojson/main.geojson"
          generateId={true}
        >
          <Layer {...polygonLayer} />
          <Layer {...lineLayer} />
          <Layer {...lineLabelLayer} />
        </Source>
        <Source
          id="focused"
          type="geojson"
          data={
            props.geoJson || {
              type: 'FeatureCollection',
              features: [],
            }
          }
          generateId
        >
          <Layer {...polygonLayerFocused} />
          <Layer {...lineLayerFocused} />
          <Layer {...lineLabelLayerFocused} />
        </Source>
      </ReactMapGL>
    </>
  );
};
