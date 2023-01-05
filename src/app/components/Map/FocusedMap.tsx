import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Map as ReactMapGL,
  Source,
  Layer,
  MapLayerMouseEvent,
  ScaleControl,
  MapboxGeoJSONFeature,
} from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import {
  lineLayerFocused,
  lineLabelLayerFocused,
  polygonLayerFocused,
} from './layers';
import { MapImage } from './Components/MapImage';
import mapboxgl from 'mapbox-gl';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { Skeleton } from '@mui/material';
import {
  cursorInteractableLayers,
  lineLabelLayer,
  lineLayer,
  mouseHoverableLayers,
  polygonLayer,
} from './layers';
import { calculateBounds, parseMapFeature } from './mapUtils';
import { FeatureCollection } from '@turf/turf';
import { defaultMapViewState, MAPBOX_TOKEN } from './constants';

// FIX: https://github.com/visgl/react-map-gl/issues/1266
// @ts-ignore
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface Props {
  onFeatureClick: (id: string, type: MapSlacklineFeatureType) => void;
  geoJson?: FeatureCollection;
}

export const FocusedMap = (props: Props) => {
  const mapRef = useRef<MapRef>(null);
  const { isDesktop } = useMediaQuery();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [cursor, setCursor] = useState('auto');
  const [hoveredFeature, setHoveredFeature] = useState<MapboxGeoJSONFeature>();

  useEffect(() => {
    if (!isMapLoaded || !props.geoJson || !mapRef.current) return;
    const map = mapRef.current;

    const { marginedBounds } = calculateBounds(
      props.geoJson,
      props.geoJson.features[0].properties?.l,
    );
    map.fitBounds(marginedBounds, {
      // padding: isDesktop ? 100 : 50,
      animate: map.getZoom() > 10,
    });
    setIsMapReady(true);
  }, [isDesktop, isMapLoaded, props.geoJson]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (hoveredFeature) {
      map.setFeatureState(hoveredFeature, { hover: true });
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const map = mapRef.current;
      if (hoveredFeature) {
        map?.removeFeatureState(hoveredFeature, 'hover');
      }
    };
  }, [hoveredFeature]);

  const onMapLoad = useCallback(() => {
    setIsMapLoaded(true);
    mapRef.current?.setPadding({ top: 0, left: 0, bottom: 0, right: 0 });
  }, []);

  const onMouseMove = (event: MapLayerMouseEvent) => {
    if (!isMapLoaded) return;

    const feature = event.features?.[0];
    if (!feature) {
      setHoveredFeature(undefined);
      setCursor('auto');
      return;
    }

    if (cursorInteractableLayers.includes(feature.layer.id)) {
      setCursor('pointer');
    }

    if (mouseHoverableLayers.includes(feature.layer.id)) {
      setHoveredFeature(feature);
    }
  };

  const onMapClick = (event: MapLayerMouseEvent) => {
    if (!isMapLoaded) return;

    const feature = event.features?.[0];
    if (!feature) {
      return;
    }
    if (mouseHoverableLayers.includes(feature.layer.id)) {
      const { originalId, type } = parseMapFeature(feature);
      if (originalId && type) {
        props.onFeatureClick(originalId, type);
      }
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
        initialViewState={defaultMapViewState}
        mapStyle={'mapbox://styles/mapbox/satellite-streets-v11'}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        onLoad={onMapLoad}
        reuseMaps
        ref={mapRef}
        onMouseMove={onMouseMove}
        onClick={onMapClick}
        interactiveLayerIds={[
          polygonLayer.id!,
          lineLabelLayer.id!,
          lineLayer.id!,
        ]}
        cursor={cursor}
        pitchWithRotate={false}
        maxPitch={0}
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
            (props.geoJson as any) || {
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
