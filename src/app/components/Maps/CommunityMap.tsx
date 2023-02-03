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
import {
  defaultMapSettings,
  defaultMapViewState,
  MAPBOX_TOKEN,
  mapStyles,
} from './constants';
import { MapLogo } from './Components/Logo';
import { MapLoadingPlaceholder } from './Components/MapLoadingPlaceholder';
import { CustomPopup } from './Components/Popups/CustomPopup';
import { LegendMenuItem, MapLegend } from './Components/MapLegend';
import { CommunityMapSources } from './sources';
import {
  useHoveredFeature,
  useLegendMenu,
  useMapEvents,
  useSelectedFeature,
  useZoomToUserLocationOnMapLoad,
} from './mapHooks';
import { parseMapFeature } from './mapUtils';
import { useSearchParams } from 'react-router-dom';

type LegendType = 'groups' | 'managedAreas';
interface Props {
  popup?: React.ReactNode;
  onSelectedFeatureChange?: (feature?: MapboxGeoJSONFeature) => void;
}

export const CommunityMap = (props: Props) => {
  const mapRef = useRef<MapRef>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [zoomLevel, setZoomLevel] = useState<number>();
  const { projection } = useMapStyle(zoomLevel);
  const [popupLocation, setPopupLocation] = useState<Position>();

  const { legendMenu, legendValues, onLegendItemsUpdated } = useLegendMenu({
    groups: {
      label: 'Groups',
      isSelected:
        searchParams.get('legend') === 'groups' || !searchParams.get('legend'),
    },
    managedAreas: {
      label: 'Managed Areas',
      isSelected: searchParams.get('legend') === 'managedAreas',
    },
  });

  useEffect(() => {
    onPopupClose();
    let selectedLegend: LegendType = 'groups';
    if (legendValues.managedAreas) {
      selectedLegend = 'managedAreas';
    }
    searchParams.set('legend', selectedLegend);
    setSearchParams(searchParams, { replace: true });
  }, [legendValues]);

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

  useZoomToUserLocationOnMapLoad(mapRef, isMapLoaded);

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
      <MapLegend
        menu={legendMenu}
        onItemsUpdated={onLegendItemsUpdated}
        exclusiveSelection
      />
      <ReactMapGL
        {...defaultMapSettings}
        initialViewState={defaultMapViewState}
        mapStyle={mapStyles.light}
        interactiveLayerIds={[
          pointLayer('slacklineGroup').id,
          polygonLayer('managedArea').id,
        ]}
        onLoad={onMapLoad}
        onSourceData={onSourceData}
        onClick={onMapClick}
        onMouseMove={onMouseMove}
        cursor={cursor}
        ref={mapRef}
        projection={projection}
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
        <CommunityMapSources options={legendValues} />
      </ReactMapGL>
    </>
  );
};
