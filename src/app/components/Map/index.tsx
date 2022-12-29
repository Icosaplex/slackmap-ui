import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Map as ReactMapGL,
  Source,
  Layer,
  MapLayerMouseEvent,
  GeolocateControl,
  AttributionControl,
  ScaleControl,
  NavigationControl,
  Popup,
  MapboxGeoJSONFeature,
  ViewStateChangeEvent,
  ViewState,
} from 'react-map-gl';
import type { Point, Position } from 'geojson';
import type { MapRef } from 'react-map-gl';
import type { GeoJSONSource } from 'react-map-gl';
import {
  clusterCountLayer,
  clusterLayer,
  lineLabelLayer,
  lineLayer,
  polygonLayer,
  polygonOutlineLayer,
  unclusteredPointLayer,
  polygonLabelLayer,
} from './layers';
import { useMapStyle } from './useMapStyle';
import MapImage from './MapImage';
import { ShortInfoPopup } from './ShortInfoPopup';
import { useSearchParams } from 'react-router-dom';
import mapboxgl, { MapSourceDataEvent } from 'mapbox-gl';
import { mapUrlSearchParams } from './mapUtils';
import { MapSlacklineFeatureType } from './types';
import { LineString } from '@turf/turf';

// FIX: https://github.com/visgl/react-map-gl/issues/1266
// @ts-ignore
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
interface Props {
  onFeatureClick?: (
    feature: MapboxGeoJSONFeature,
    type: MapSlacklineFeatureType,
    id: string,
  ) => void;
  featureIdToFocus?: string;
  syncMapLocationToUrlParams?: boolean;
  initialViewState?: Partial<ViewState>;
}

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const defaultMapState = {
  latitude: 35.92263245263329,
  longitude: -39.41644394307363,
  zoom: 1,
};

const cursorInteractiveleLayers = [
  lineLabelLayer.id,
  lineLayer.id,
  polygonLayer.id,
  unclusteredPointLayer.id,
];

const mouseHoverableLayers = [lineLabelLayer.id, lineLayer.id, polygonLayer.id];

export const Map = (props: Props) => {
  const mapRef = useRef<MapRef>(null);

  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [isMapDataLoaded, setIsMapDataLoaded] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>();
  const mapStyle = useMapStyle(
    props.initialViewState?.zoom ?? zoomLevel,
    isMapLoaded,
  );
  const [cursor, setCursor] = useState('auto');
  const [hoveredFeature, setHoveredFeature] = useState<MapboxGeoJSONFeature>();
  const [selectedFeature, setSelectedFeature] =
    useState<MapboxGeoJSONFeature>();
  const [popup, setPopup] = useState<{
    feature: MapboxGeoJSONFeature;
    position: Position;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();

  const moveMapTo = (position: Position, zoom: number) => {
    mapRef.current?.flyTo({
      center: [position[0], position[1]],
      zoom: zoom,
      duration: 300,
    });
  };

  const onMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  const onSourceData = useCallback((e: MapSourceDataEvent) => {
    if (e.sourceId === 'main' || e.sourceId === 'points') {
      setIsMapDataLoaded(e.isSourceLoaded);
    }
  }, []);

  useEffect(() => {
    const zoomToUserLocation = async () => {
      const response = await fetch('https://ipapi.co/json/')
        .then(r =>
          r.json().then(data => ({
            longitude: data.longitude as number,
            latitude: data.latitude as number,
            zoom: 6,
          })),
        )
        .catch(err => defaultMapState);

      moveMapTo([response.longitude, response.latitude], response.zoom);
    };
    if (!props.initialViewState && !props.featureIdToFocus) {
      zoomToUserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (hoveredFeature) {
      map?.setFeatureState(hoveredFeature, { hover: true });
    }
    return () => {
      if (hoveredFeature) {
        map?.removeFeatureState(hoveredFeature, 'hover');
      }
    };
  }, [hoveredFeature]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (selectedFeature) {
      map?.setFeatureState(selectedFeature, { isSelected: true });
      // setPopup({
      //   feature: selectedFeature,
      //   position: (selectedFeature.geometry as LineString)
      //     .coordinates[0] as Position,
      // });
    }
    return () => {
      if (selectedFeature) {
        map?.removeFeatureState(selectedFeature, 'isSelected');
      }
    };
  }, [selectedFeature]);

  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (props.featureIdToFocus && isMapDataLoaded) {
      const lines = map?.queryRenderedFeatures(undefined, {
        layers: [lineLayer.id!],
      });
      for (const line of lines ?? []) {
        console.log(props.featureIdToFocus, line.properties);
      }
      // console.log(
      //   props.featureIdToFocus,
      //   lines?.find(l => l.properties?.id === props.featureIdToFocus),
      // );
    }
  }, [isMapDataLoaded, props.featureIdToFocus]);

  const onMapMoveEnd = (event: ViewStateChangeEvent) => {
    if (props.syncMapLocationToUrlParams) {
      const { longitude, latitude, zoom } = event.viewState;
      searchParams.set(
        'map',
        mapUrlSearchParams.stringify(longitude, latitude, zoom),
      );
      setSearchParams(searchParams, { replace: true });
    }
  };

  const onMouseMove = (event: MapLayerMouseEvent) => {
    if (!isMapLoaded) return;
    const feature = event.features?.[0];
    if (!feature) {
      setHoveredFeature(undefined);
      setCursor('auto');
      return;
    }

    if (cursorInteractiveleLayers.includes(feature.layer.id)) {
      setCursor('pointer');
    }

    if (mouseHoverableLayers.includes(feature.layer.id) && !selectedFeature) {
      setHoveredFeature(feature);
    }
  };

  const onClick = (event: MapLayerMouseEvent) => {
    if (!isMapLoaded) return;
    const feature = event.features?.[0];
    if (!feature) {
      setSelectedFeature(undefined);
      return;
    }

    const clusterId = feature?.properties?.cluster_id;
    if (clusterId) {
      const mapboxSource = mapRef.current?.getSource('points') as GeoJSONSource;

      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }
        const coordinates = (feature.geometry as Point).coordinates;
        moveMapTo([coordinates[0], coordinates[1]], zoom);
      });
      return;
    }
    if (feature.layer.id === unclusteredPointLayer.id) {
      const coordinates = (feature.geometry as Point).coordinates;
      moveMapTo([coordinates[0], coordinates[1]], 16);
      return;
    }
    if (mouseHoverableLayers.includes(feature.layer.id)) {
      setSelectedFeature(feature);
      const originalId = feature.properties?.id;
      let type: MapSlacklineFeatureType | undefined;
      switch (feature.layer.id) {
        case lineLayer.id:
        case lineLabelLayer.id:
          type = 'line';
          break;
        case polygonLayer.id:
        case polygonLabelLayer.id:
          type = 'spot';
          break;
        default:
          break;
      }
      if (originalId && type) {
        props.onFeatureClick?.(feature, type, originalId);
      }
    }
  };

  return (
    <ReactMapGL
      initialViewState={props.initialViewState || defaultMapState}
      mapStyle={mapStyle}
      mapboxAccessToken={MAPBOX_TOKEN}
      interactiveLayerIds={[
        clusterLayer.id!,
        polygonLayer.id!,
        polygonLabelLayer.id!,
        lineLabelLayer.id!,
        lineLayer.id!,
        unclusteredPointLayer.id!,
      ]}
      attributionControl={false}
      onLoad={onMapLoad}
      onClick={onClick}
      onMoveEnd={onMapMoveEnd}
      onMouseMove={onMouseMove}
      cursor={cursor}
      onSourceData={onSourceData}
      onZoom={e => {
        setZoomLevel(e.viewState.zoom);
      }}
      reuseMaps
      ref={mapRef}
      // projection="globe"
    >
      <GeolocateControl />
      <AttributionControl
        compact
        customAttribution="International Slackline Association"
      />
      <ScaleControl />
      <NavigationControl />
      <MapImage name={'marker'} url={'/images/line-marker.png'} />
      {popup && (
        <Popup
          longitude={popup.position[0]}
          latitude={popup.position[1]}
          anchor="left"
          onClose={() => setPopup(undefined)}
        >
          <ShortInfoPopup />
        </Popup>
      )}

      <Source
        id="points"
        type="geojson"
        data="https://d1hbfm0s717r1n.cloudfront.net/geojson/points.geojson"
        cluster={true}
        clusterMaxZoom={13}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
      <Source
        id="main"
        type="geojson"
        data="https://d1hbfm0s717r1n.cloudfront.net/geojson/main.geojson"
        generateId={true}
      >
        <Layer {...polygonLayer} />
        <Layer {...polygonOutlineLayer} />
        <Layer {...polygonLabelLayer} />
        <Layer {...lineLayer} />
        <Layer {...lineLabelLayer} />
      </Source>
    </ReactMapGL>
  );
}
