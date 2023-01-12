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
  cursorInteractableLayerIds,
  layers,
  lineLabelLayer,
  lineLayer,
  mouseHoverableLayersIds,
  polygonLayer,
} from './layers';
import { MapImage } from './Components/MapImage';
import { calculateBounds, parseMapFeature } from './mapUtils';
import { FeatureCollection } from '@turf/turf';
import {
  defaultMapViewState,
  geoJsonURL,
  MAPBOX_TOKEN,
  mapStyles,
} from './constants';
import { FocusedButton } from './Components/FocusButton';
import { MapLoadingPlaceholder } from './Components/MapLoadingPlaceholder';
import { MapSources } from './sources';

interface Props {
  onFeatureClick: (id: string, type: MapSlacklineFeatureType) => void;
  geoJson?: FeatureCollection;
}

export const FocusedMap = (props: Props) => {
  const mapRef = useRef<MapRef>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [cursor, setCursor] = useState('auto');
  const [hoveredFeature, setHoveredFeature] = useState<MapboxGeoJSONFeature>();
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>();

  const fitMapToCurrentGeoJson = useCallback(
    (opts: { animate?: boolean } = {}) => {
      if (!isMapLoaded || !props.geoJson || !mapRef.current) return;
      const map = mapRef.current;

      const { marginedBounds } = calculateBounds(
        props.geoJson,
        props.geoJson.features[0].properties?.l,
      );
      map.fitBounds(marginedBounds, {
        animate: opts.animate || map.getZoom() > 10,
      });
    },
    [isMapLoaded, props.geoJson],
  );

  useEffect(() => {
    if (!isMapLoaded || !props.geoJson || !mapRef.current) return;
    fitMapToCurrentGeoJson();
    setIsMapReady(true);
    setSelectedFeatureId(props.geoJson.features[0].id as string);
  }, [fitMapToCurrentGeoJson, isMapLoaded, props.geoJson]);

  useEffect(() => {
    mapRef.current?.setFeatureState(
      { id: selectedFeatureId, source: 'focused' },
      { isSelected: true },
    );
  }, [selectedFeatureId]);

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

    if (cursorInteractableLayerIds.includes(feature.layer.id)) {
      setCursor('pointer');
    }

    if (mouseHoverableLayersIds.includes(feature.layer.id)) {
      setHoveredFeature(feature);
    }
  };

  const onMapClick = (event: MapLayerMouseEvent) => {
    if (!isMapLoaded) return;

    const feature = event.features?.[0];
    if (!feature) {
      return;
    }
    if (mouseHoverableLayersIds.includes(feature.layer.id)) {
      const { originalId, type } = parseMapFeature(feature);
      if (originalId && type) {
        props.onFeatureClick(originalId, type);
      }
    }
  };

  const onFocusClick = () => {
    if (!isMapLoaded || !props.geoJson || !mapRef.current) return;
    fitMapToCurrentGeoJson({ animate: true });
  };

  return (
    <>
      {!isMapReady && <MapLoadingPlaceholder />}
      <FocusedButton onFocusClick={onFocusClick} />
      <ReactMapGL
        initialViewState={defaultMapViewState}
        mapStyle={mapStyles.satelliteStreets}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        onLoad={onMapLoad}
        // reuseMaps
        ref={mapRef}
        onMouseMove={onMouseMove}
        onClick={onMapClick}
        interactiveLayerIds={[
          lineLayer.id!,
          lineLabelLayer.id!,
          polygonLayer.id!,
        ]}
        cursor={cursor}
        pitchWithRotate={false}
        maxPitch={0}
      >
        <ScaleControl />
        <MapImage name={'marker'} url={'/images/line-marker.png'} />
        <MapSources
          options={{ lines: true, guides: true, spots: true }}
          disableClustering
          // excludeId={selectedFeatureId}
        />
        <Source
          id="focused"
          type="geojson"
          data={
            (props.geoJson as any) || {
              type: 'FeatureCollection',
              features: [],
            }
          }
          promoteId="id"
        >
          <Layer {...polygonLayer} id="polygonFocused" />
          <Layer {...lineLayer} id="lineFocused" />
          <Layer {...lineLabelLayer} id="lineLabelFocused" />
        </Source>
      </ReactMapGL>
    </>
  );
};
