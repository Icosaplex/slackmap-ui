import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
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

// FIX: https://github.com/visgl/react-map-gl/issues/1266
// @ts-ignore
import mapboxgl from 'mapbox-gl';
// @ts-ignore
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface Props {}

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

export function Map(props: Props) {
  const mapRef = useRef<MapRef>(null);

  const { mapStyle, setZoomLevel } = useMapStyle();
  const [cursor, setCursor] = useState('auto');
  const [hoveredFeature, setHoveredFeature] = useState<string | number>();
  const [popup, setPopup] = useState<{
    feature: MapboxGeoJSONFeature;
    position: Position;
  }>();

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

      mapRef.current?.easeTo({
        center: [response.longitude, response.latitude],
        zoom: response.zoom,
        duration: 300,
      });
    };
    // zoomToUserLocation();
  }, []);

  const onMouseMove = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) {
      mapRef.current?.removeFeatureState({
        id: hoveredFeature,
        source: 'main',
      });
      setCursor('auto');
      return;
    }

    if (cursorInteractiveleLayers.includes(feature.layer.id)) {
      setCursor('pointer');
    }

    if (mouseHoverableLayers.includes(feature.layer.id)) {
      if (hoveredFeature !== feature.id) {
        mapRef.current?.removeFeatureState({
          id: hoveredFeature,
          source: 'main',
        });
        setPopup(undefined);
      }
      mapRef.current?.setFeatureState(feature, { hover: true });
      setHoveredFeature(feature.id);
    }
  };

  const onClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const clusterId = feature?.properties?.cluster_id;
    if (clusterId) {
      const mapboxSource = mapRef.current?.getSource('points') as GeoJSONSource;

      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }
        const coordinates = (feature.geometry as Point).coordinates;
        mapRef.current?.easeTo({
          center: [coordinates[0], coordinates[1]],
          zoom,
          duration: 500,
        });
      });
      return;
    }
    if (feature.layer.id === unclusteredPointLayer.id) {
      const coordinates = (feature.geometry as Point).coordinates;
      mapRef.current?.easeTo({
        center: [coordinates[0], coordinates[1]],
        zoom: 16,
        duration: 500,
      });
      return;
    }
    if (mouseHoverableLayers.includes(feature.layer.id)) {
      const lngLat = event.lngLat;
      // setPopup({ feature, position: [lngLat.lng, lngLat.lat] });
    }
  };

  return (
    <ReactMapGL
      initialViewState={{
        latitude: 35.92263245263329,
        longitude: -39.41644394307363,
        zoom: 1,
      }}
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
      onClick={onClick}
      onMouseMove={onMouseMove}
      cursor={cursor}
      onZoom={e => {
        setZoomLevel(e.viewState.zoom);
      }}
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
          anchor="bottom"
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
