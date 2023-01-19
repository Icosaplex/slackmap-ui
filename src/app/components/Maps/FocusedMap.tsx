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
  isCursorInteractableLayer,
  isMouseHoverableLayer,
  lineLabelLayer,
  lineLayer,
  polygonLayer,
  unclusteredPointLayer,
} from './layers';
import { MapImage } from './Components/MapImage';
import {
  calculateBounds,
  fitMapToGeoJson,
  parseMapFeature,
  pointsGeoJsonDict,
} from './mapUtils';
import { FeatureCollection } from '@turf/turf';
import { defaultMapViewState, MAPBOX_TOKEN, mapStyles } from './constants';
import { FocusedButton } from './Components/FocusButton';
import { MapLoadingPlaceholder } from './Components/MapLoadingPlaceholder';
import { MapSources } from './sources';
import { LegendOptions, MapLegend } from './Components/MapLegend';
import { useHoveredFeature, useMapEvents } from './mapHooks';

interface Props {
  geoJson?: FeatureCollection;
  onFeatureClick?: (feature: MapboxGeoJSONFeature) => void;
}

export const FocusedMap = (props: Props) => {
  const mapRef = useRef<MapRef>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [legendOptions, setLegendOptions] = useState<LegendOptions>({
    lines: true,
    spots: true,
  });

  const setHoveredFeature = useHoveredFeature(mapRef);
  // const setSelectedFeature = useSelectedFeature(mapRef);
  const { isMapLoaded, onMapLoad, onMouseMove, onMapClick, cursor } =
    useMapEvents(mapRef, {
      onMouseMovedToFeature(feature) {
        if (isMouseHoverableLayer(feature.layer.id)) {
          setHoveredFeature(feature);
        }
      },
      onMouseMovedToVoid() {
        setHoveredFeature(undefined);
      },
      onClickedToFeature(feature) {
        if (isMouseHoverableLayer(feature.layer.id)) {
          props.onFeatureClick?.(feature);
        }
      },
    });

  useEffect(() => {
    if (!isMapLoaded || !props.geoJson || !mapRef.current) return;
    fitMapToGeoJson(mapRef, props.geoJson);
    setIsMapReady(true);
    const geoJson = props.geoJson;
    for (const feature of geoJson.features) {
      if (feature.geometry.type === 'LineString') {
        mapRef.current?.setFeatureState(
          { id: feature.properties?.id, source: 'lines' },
          { isSelected: true },
        );
      }
      if (feature.geometry.type === 'Polygon') {
        mapRef.current?.setFeatureState(
          { id: feature.properties?.id, source: 'spots' },
          { isSelected: true },
        );
      }
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const map = mapRef.current;
      for (const feature of geoJson.features) {
        if (feature.geometry.type === 'LineString') {
          map?.removeFeatureState(
            { id: feature.properties?.id, source: 'lines' },
            'isSelected',
          );
        }
        if (feature.geometry.type === 'Polygon') {
          map?.removeFeatureState(
            { id: feature.properties?.id, source: 'spots' },
            'isSelected',
          );
        }
      }
    };
  }, [isMapLoaded, props.geoJson]);

  const onFocusClick = () => {
    fitMapToGeoJson(mapRef, props.geoJson, { animate: true });
  };

  const onLegendOptionsUpdate = (options: LegendOptions) => {
    setLegendOptions(options);
  };
  return (
    <>
      {!isMapReady && <MapLoadingPlaceholder />}
      <FocusedButton onFocusClick={onFocusClick} />
      <MapLegend
        options={legendOptions}
        onOptionsChange={onLegendOptionsUpdate}
      />
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
        <MapSources options={legendOptions} disableClustering />
      </ReactMapGL>
    </>
  );
};
