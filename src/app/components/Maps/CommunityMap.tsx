import * as React from 'react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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
  PopupProps,
} from 'react-map-gl';
import type { Point, Position } from 'geojson';
import type { MapRef } from 'react-map-gl';
import {
  unclusteredPointLayer,
  lineLayer,
  lineLabelLayer,
  polygonLayer,
  clusterLayer,
  polygonLabelLayer,
  isMouseHoverableLayer,
  pointLayer,
} from './layers';
import { useMapStyle } from './useMapStyle';
import { MapImage } from './Components/MapImage';
import { defaultMapViewState, MAPBOX_TOKEN, mapStyles } from './constants';
import { MapLogo } from './Components/Logo';
import { MapLoadingPlaceholder } from './Components/MapLoadingPlaceholder';
import { CustomPopup } from './Components/Popups/CustomPopup';
import { LegendOptions, MapLegend } from './Components/MapLegend';
import { MapSources } from './sources';
import {
  useHoveredFeature,
  useMapEvents,
  useSelectedFeature,
  useZoomToUserLocationOnMapLoad,
} from './mapHooks';
import { parseMapFeature } from './mapUtils';

interface Props {
  onMapMoveEnd?: (event: ViewStateChangeEvent) => void;
  initialViewState?: Partial<ViewState>;
  popup?: React.ReactNode;
  onSelectedFeatureChange?: (feature?: MapboxGeoJSONFeature) => void;
}

export const CommunityMap = (props: Props) => {
  const mapRef = useRef<MapRef>(null);
  const [zoomLevel, setZoomLevel] = useState(props.initialViewState?.zoom);
  const { projection } = useMapStyle(zoomLevel);
  const [popupLocation, setPopupLocation] = useState<Position>();

  const setHoveredFeature = useHoveredFeature(mapRef);
  const setSelectedFeature = useSelectedFeature(mapRef);
  const {
    isMapLoaded,
    onMapLoad,
    onSourceData,
    onMouseMove,
    onMapClick,
    cursor,
  } = useMapEvents(mapRef, {
    onMouseMovedToFeature(feature) {
      if (isMouseHoverableLayer(feature.layer.id)) {
        setHoveredFeature(feature);
      }
    },
    onMouseMovedToVoid() {
      setHoveredFeature(undefined);
    },
    onClickedToVoid() {
      setSelectedFeature(undefined);
      setPopupLocation(undefined);
      props.onSelectedFeatureChange?.(undefined);
    },
    onClickedToFeature(feature) {
      setSelectedFeature(feature);
      const { center } = parseMapFeature(feature);
      setPopupLocation(center);
      props.onSelectedFeatureChange?.(feature);
    },
  });

  useZoomToUserLocationOnMapLoad(
    mapRef,
    isMapLoaded && !props.initialViewState,
  );

  const onPopupClose = () => {
    setPopupLocation(undefined);
    mapRef.current?.easeTo({
      padding: { top: 0, left: 0, bottom: 0, right: 0 },
    });
  };

  return (
    <>
      {!isMapLoaded && <MapLoadingPlaceholder />}
      <MapLogo />
      <ReactMapGL
        initialViewState={props.initialViewState || defaultMapViewState}
        mapStyle={mapStyles.light}
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[pointLayer!.id]}
        attributionControl={false}
        onLoad={onMapLoad}
        onSourceData={onSourceData}
        onClick={onMapClick}
        onMoveEnd={props.onMapMoveEnd}
        onMouseMove={onMouseMove}
        cursor={cursor}
        pitchWithRotate={false}
        maxPitch={0}
        // reuseMaps
        ref={mapRef}
        projection={projection}
        fog={
          {
            'horizon-blend': 0.1,
            color: 'grey',
            'high-color': 'black',
          } as any
        }
        onZoom={e => {
          setZoomLevel(e.viewState.zoom);
        }}
      >
        <GeolocateControl />
        <AttributionControl
          compact
          customAttribution="International Slackline Association"
        />
        <ScaleControl />
        <NavigationControl />
        <MapImage name={'marker'} url={'/images/line-marker.png'} />
        {popupLocation && props.popup && (
          <CustomPopup
            key={popupLocation[0] + popupLocation[1]}
            longitude={popupLocation[0]}
            latitude={popupLocation[1]}
            anchor="left"
            onClose={onPopupClose}
            maxWidth="none"
          >
            {props.popup}
          </CustomPopup>
        )}
        <MapSources options={{ communities: true }} />
      </ReactMapGL>
    </>
  );
};
