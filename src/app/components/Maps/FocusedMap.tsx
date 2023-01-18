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
} from './layers';
import { MapImage } from './Components/MapImage';
import { calculateBounds, parseMapFeature } from './mapUtils';
import { FeatureCollection } from '@turf/turf';
import { defaultMapViewState, MAPBOX_TOKEN, mapStyles } from './constants';
import { FocusedButton } from './Components/FocusButton';
import { MapLoadingPlaceholder } from './Components/MapLoadingPlaceholder';
import { MapSources } from './sources';
import { LegendOptions, MapLegend } from './Components/MapLegend';

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
  const [legendOptions, setLegendOptions] = useState<LegendOptions>({
    lines: true,
    spots: true,
  });

  const fitMapToCurrentGeoJson = useCallback(
    (opts: { animate?: boolean } = {}) => {
      if (!isMapLoaded || !props.geoJson || !mapRef.current) return;
      const map = mapRef.current;

      const { marginedBounds } = calculateBounds(
        props.geoJson,
        parseFloat(props.geoJson.features[0].properties?.l),
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
  }, [fitMapToCurrentGeoJson, isMapLoaded, props.geoJson]);

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

    if (isCursorInteractableLayer(feature.layer.id)) {
      setCursor('pointer');
    }

    if (isMouseHoverableLayer(feature.layer.id)) {
      setHoveredFeature(feature);
    }
  };

  const onMapClick = (event: MapLayerMouseEvent) => {
    if (!isMapLoaded) return;

    const feature = event.features?.[0];
    if (!feature) {
      return;
    }
    if (isMouseHoverableLayer(feature.layer.id)) {
      const { id, type } = parseMapFeature(feature);
      if (id && typeof id === 'string' && type) {
        props.onFeatureClick(id, type);
      }
    }
  };

  const onFocusClick = () => {
    if (!isMapLoaded || !props.geoJson || !mapRef.current) return;
    fitMapToCurrentGeoJson({ animate: true });
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
