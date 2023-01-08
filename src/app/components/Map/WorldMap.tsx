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
  clusterCountLayer,
  clusterLayer,
  lineLabelLayer,
  lineLayer,
  polygonLayer,
  polygonOutlineLayer,
  unclusteredPointLayer,
  polygonLabelLayer,
  cursorInteractableLayers,
  mouseHoverableLayers,
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
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { defaultMapViewState, geoJsonURL, MAPBOX_TOKEN } from './constants';
import { MapLogo } from './Components/Logo';

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
  const mapStyle = useMapStyle(zoomLevel);
  const [cursor, setCursor] = useState('auto');
  const [hoveredFeature, setHoveredFeature] = useState<MapboxGeoJSONFeature>();
  const [selectedFeature, setSelectedFeature] =
    useState<MapboxGeoJSONFeature>();
  const [popup, setPopup] = useState<{
    feature: MapboxGeoJSONFeature;
    type: MapSlacklineFeatureType;
    id: string;
    position: Position;
  }>();
  const [isPointsLoaded, setIsPointsLoaded] = useState(false);
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

  const padMap = (padding?: Partial<PaddingOptions>) => {
    const map = mapRef.current;
    if (padding) {
      map?.easeTo({
        padding: { top: 0, left: 0, bottom: 0, right: 0, ...padding },
      });
    } else {
      map?.easeTo({ padding: { top: 0, left: 0, bottom: 0, right: 0 } });
    }
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
            zoom: 6,
          })),
        )
        .catch(err => undefined);
      if (response) {
        flyTo([response.longitude, response.latitude], { zoom: response.zoom });
      }
    };
    zoomToUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded, props.zoomToUserLocation, props.initialViewState]);

  useEffect(() => {
    if (!isPointsLoaded) return;
    cachePointsGeoJson();
  }, [isPointsLoaded]);

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
      const { center, originalId, type } = parseMapFeature(selectedFeature);
      if (center) {
        flyTo(center, { padding: { right: !isDesktop ? 200 : 0 } });
      }
      if (originalId && type && center && props.showInfoPopup) {
        setPopup({
          feature: selectedFeature,
          type,
          id: originalId,
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

    if (mouseHoverableLayers.includes(feature.layer.id) && !selectedFeature) {
      setHoveredFeature(feature);
    }
  };

  const onSourceData = (event: MapSourceDataEvent) => {
    if (event.sourceId === 'points' && event.isSourceLoaded) {
      setIsPointsLoaded(true);
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
        flyTo([coordinates[0], coordinates[1]], { zoom });
      });
      return;
    }
    if (feature.layer.id === unclusteredPointLayer.id) {
      const pointFeature = pointsGeoJsonDict[feature.properties?.id];
      if (pointFeature) {
        const { marginedBounds } = calculateBounds(
          pointFeature.geometry,
          feature.properties?.l,
        );
        mapRef.current?.fitBounds(marginedBounds);
      }

      // flyTo(coordinates, { zoom: 16 });
      return;
    }
    if (mouseHoverableLayers.includes(feature.layer.id)) {
      setSelectedFeature(feature);
    }
  };

  return (
    <>
      {!isMapLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            backgroundColor: theme => theme.palette.background.paper,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 10,
          }}
        >
          <img
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            src={'/images/slackmapLogo.png'}
            alt=""
          />
          <Typography
            variant="h6"
            sx={{ color: t => t.palette.text.secondary }}
          >
            Loading Map...
          </Typography>
        </Box>
      )}
      <MapLogo />
      <ReactMapGL
        initialViewState={props.initialViewState || defaultMapViewState}
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

        <Source
          id="points"
          type="geojson"
          data={geoJsonURL.points}
          cluster={true}
          clusterMaxZoom={13}
          clusterMinPoints={3}
          clusterRadius={50}
          generateId={true}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
        <Source
          id="main"
          type="geojson"
          data={geoJsonURL.main}
          generateId={true}
        >
          <Layer {...polygonLayer} />
          <Layer {...polygonOutlineLayer} />
          <Layer {...polygonLabelLayer} />
          <Layer {...lineLayer} />
          <Layer {...lineLabelLayer} />
        </Source>
      </ReactMapGL>
    </>
  );
};

const CustomPopup = styled(Popup)<PopupProps>(({ theme }) => ({
  '.mapboxgl-popup-content': {
    padding: 4,
    background: 'transparent',
    border: 'none',
  },
  '.mapboxgl-popup-close-button': {
    display: 'none',
  },
}));
