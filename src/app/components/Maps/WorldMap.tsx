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
  PopupProps,
} from 'react-map-gl';
import type { Point, Position } from 'geojson';
import type { MapRef } from 'react-map-gl';
import type { GeoJSONSource } from 'react-map-gl';
import {
  layers,
  cursorInteractableLayerIds,
  mouseHoverableLayersIds,
  unclusteredPointLayer,
  lineLayer,
  lineLabelLayer,
  polygonLayer,
  clusterLayer,
  polygonLabelLayer,
  polygonOutlineLayer,
} from './layers';
import { useMapStyle } from './useMapStyle';
import { MapImage } from './Components/MapImage';
import { InfoPopup } from './Components/InfoPopup';
import { FlyToOptions, MapSourceDataEvent, PaddingOptions } from 'mapbox-gl';
import {
  cachePointsGeoJson,
  calculateBounds,
  parseMapFeature,
  pointsGeoJsonDict,
} from './mapUtils';
import { FeatureCollection } from '@turf/turf';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { defaultMapViewState, MAPBOX_TOKEN } from './constants';
import { MapLogo } from './Components/Logo';
import { MapLoadingPlaceholder } from './Components/MapLoadingPlaceholder';
import { CustomPopup } from './Components/CustomPopup';
import { LegendOptions, MapLegend } from './Components/MapLegend';
import { MapSources } from './sources';

interface Props {
  onPopupDetailsClick?: (id: string, type: MapSlacklineFeatureType) => void;
  onMapMoveEnd?: (event: ViewStateChangeEvent) => void;
  zoomToUserLocation?: boolean;
  initialViewState?: Partial<ViewState>;
  selectedFeature?: FeatureCollection;
  showInfoPopup?: boolean;
}

export const WorldMap = (props: Props) => {
  const mapRef = useRef<MapRef>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState(props.initialViewState?.zoom);
  const { mapStyle, projection } = useMapStyle(zoomLevel);
  const [cursor, setCursor] = useState('auto');
  const [hoveredFeature, setHoveredFeature] = useState<MapboxGeoJSONFeature>();
  const [selectedFeature, setSelectedFeature] =
    useState<MapboxGeoJSONFeature>();
  const [legendOptions, setLegendOptions] = useState<LegendOptions>({
    lines: true,
    spots: true,
  });

  const [popup, setPopup] = useState<{
    feature: MapboxGeoJSONFeature;
    type: MapSlacklineFeatureType;
    id: string;
    position: Position;
  }>();
  const [loadedSourceId, setLoadedSourceId] = useState<string>();
  const { isDesktop } = useMediaQuery();

  const flyTo = (
    position: Position,
    opts: { zoom?: number; padding?: Partial<PaddingOptions> } = {},
  ) => {
    const map = mapRef.current;
    const params: FlyToOptions = {
      center: [position[0], position[1]],
      duration: 300,
    };
    if (opts.zoom) params.zoom = opts.zoom;
    if (opts.padding)
      params.padding = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        ...opts.padding,
      };
    map?.flyTo(params);
  };

  useEffect(() => {
    if (!isMapLoaded || !props.zoomToUserLocation || props.initialViewState)
      return;
    const zoomToUserLocation = async () => {
      const response = await fetch('https://ipapi.co/json/')
        .then(r =>
          r.json().then(data => ({
            longitude: data.longitude as number,
            latitude: data.latitude as number,
            zoom: isDesktop ? 2.5 : 1.5,
          })),
        )
        .catch(err => undefined);
      if (response) {
        flyTo([response.longitude, response.latitude], { zoom: response.zoom });
      }
    };
    setPopup(undefined);
    zoomToUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded, props.zoomToUserLocation, props.initialViewState]);

  useEffect(() => {
    if (!loadedSourceId) return;
    cachePointsGeoJson(loadedSourceId);
  }, [loadedSourceId]);

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

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (selectedFeature) {
      map.setFeatureState(selectedFeature, { isSelected: true });
      const { center, id, type } = parseMapFeature(selectedFeature);
      if (center) {
        flyTo(center, { padding: { right: !isDesktop ? 200 : 0 } });
      }
      if (
        id &&
        typeof id === 'string' &&
        type &&
        center &&
        props.showInfoPopup
      ) {
        setPopup({
          feature: selectedFeature,
          type,
          id,
          position: center,
        });
      }
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const map = mapRef.current?.getMap();
      if (selectedFeature && map) {
        map.removeFeatureState(selectedFeature, 'isSelected');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, selectedFeature]);

  const onMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  const onSourceData = (event: MapSourceDataEvent) => {
    if (event.sourceId === 'clusterPoints' && event.isSourceLoaded) {
      setLoadedSourceId(event.sourceId);
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
    if (cursorInteractableLayerIds.includes(feature.layer.id)) {
      setCursor('pointer');
    }

    if (
      mouseHoverableLayersIds.includes(feature.layer.id) &&
      !selectedFeature
    ) {
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
      const mapboxSource = mapRef.current?.getSource(
        'clusterPoints',
      ) as GeoJSONSource;
      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }
        const coordinates = (feature.geometry as Point).coordinates;
        flyTo([coordinates[0], coordinates[1]], { zoom });
      });
      return;
    }
    if (feature.layer.id === unclusteredPointLayer.id) {
      const pointFeature = pointsGeoJsonDict[feature.properties?.id];
      console.log(pointFeature);
      if (pointFeature) {
        const { marginedBounds } = calculateBounds(
          pointFeature.geometry,
          parseFloat(feature.properties?.l),
        );
        mapRef.current?.fitBounds(marginedBounds);
      }
      return;
    }
    if (mouseHoverableLayersIds.includes(feature.layer.id)) {
      setSelectedFeature(feature);
    }
  };

  const onLegendOptionsUpdate = (options: LegendOptions) => {
    setLegendOptions(options);
  };

  return (
    <>
      {!isMapLoaded && <MapLoadingPlaceholder />}
      <MapLogo />
      <MapLegend
        options={legendOptions}
        onOptionsChange={onLegendOptionsUpdate}
      />
      <ReactMapGL
        initialViewState={props.initialViewState || defaultMapViewState}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[
          lineLayer.id!,
          lineLabelLayer.id!,
          polygonLayer.id!,
          polygonLabelLayer.id!,
          unclusteredPointLayer.id!,
          clusterLayer.id!,
        ]}
        attributionControl={false}
        onLoad={onMapLoad}
        onSourceData={onSourceData}
        onClick={onClick}
        onMoveEnd={props.onMapMoveEnd}
        onMouseMove={onMouseMove}
        cursor={cursor}
        onZoom={e => {
          setZoomLevel(e.viewState.zoom);
        }}
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
          <CustomPopup
            longitude={popup.position[0]}
            latitude={popup.position[1]}
            anchor="left"
            onClose={() => setPopup(undefined)}
            maxWidth="none"
          >
            <InfoPopup
              id={popup.id}
              type={popup.type}
              onDetailsClick={props.onPopupDetailsClick ?? (() => {})}
            />
          </CustomPopup>
        )}
        <MapSources options={legendOptions} />
      </ReactMapGL>
    </>
  );
};
