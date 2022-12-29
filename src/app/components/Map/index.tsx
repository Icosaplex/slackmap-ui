import * as React from 'react';
import { useEffect, useRef } from 'react';
import {
  Map as ReactMapGL,
  Source,
  Layer,
  MapLayerMouseEvent,
  GeolocateControl,
  AttributionControl,
  ScaleControl,
} from 'react-map-gl';

import { Point } from 'geojson';

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

interface Props {}

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const defaultMapState = {
  latitude: 35.92263245263329,
  longitude: -39.41644394307363,
  zoom: 1,
};

export function Map(props: Props) {
  const mapRef = useRef<MapRef>(null);

  const { mapStyle, setZoomLevel } = useMapStyle();

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

  const onClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    console.log(event.features);
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
      interactiveLayerIds={[clusterLayer.id!]}
      attributionControl={false}
      onClick={onClick}
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
      <MapImage name={'marker'} url={'/images/line-marker.png'} />

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
