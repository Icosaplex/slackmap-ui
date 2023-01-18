import { Point, Position } from 'geojson';
import {
  FlyToOptions,
  GeoJSONSource,
  MapboxGeoJSONFeature,
  MapLayerMouseEvent,
  MapSourceDataEvent,
  PaddingOptions,
} from 'mapbox-gl';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { MapRef } from 'react-map-gl';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import {
  isCursorInteractableLayer,
  isMouseHoverableLayer,
  unclusteredPointLayer,
} from './layers';
import {
  cacheClustersGeoJson,
  calculateBounds,
  flyMapTo,
  parseMapFeature,
  pointsGeoJsonDict,
  zoomToUserLocation,
} from './mapUtils';

type MapRefType = RefObject<MapRef>;

export const useZoomToUserLocationOnMapLoad = (
  mapRef: MapRefType,
  shouldZoom?: boolean,
) => {
  const { isDesktop } = useMediaQuery();
  useEffect(() => {
    if (!mapRef.current || !shouldZoom) return;

    zoomToUserLocation(mapRef, { zoom: isDesktop ? 2.5 : 1.5 });
  }, [isDesktop, shouldZoom, mapRef]);
};

export const useHoveredFeature = (mapRef: MapRefType) => {
  const [hoveredFeature, setHoveredFeature] = useState<MapboxGeoJSONFeature>();

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (hoveredFeature) {
      map.setFeatureState(hoveredFeature, { hover: true });
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const map = mapRef.current;
      if (hoveredFeature && map) {
        map?.removeFeatureState(hoveredFeature, 'hover');
      }
    };
  }, [hoveredFeature, mapRef]);

  return setHoveredFeature;
};

export const useSelectedFeature = (
  mapRef: MapRefType,
  onSelectedFeatureChange?: (feature: MapboxGeoJSONFeature) => void,
) => {
  const [selectedFeature, setSelectedFeature] =
    useState<MapboxGeoJSONFeature>();

  const { isDesktop } = useMediaQuery();

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (selectedFeature) {
      map.setFeatureState(selectedFeature, { isSelected: true });
      const { center } = parseMapFeature(selectedFeature);
      if (center) {
        flyMapTo(mapRef, center, { padding: { right: !isDesktop ? 200 : 0 } });
      }
      onSelectedFeatureChange?.(selectedFeature);
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

  return setSelectedFeature;
};

export const useMapEvents = (
  mapRef: MapRefType,
  opts: {
    clusterSourceId?: string;
    onMouseMovedToFeature?: (feature: MapboxGeoJSONFeature) => void;
    onMouseMovedToVoid?: () => void;
    onClickedToFeature?: (feature: MapboxGeoJSONFeature) => void;
    onClickedToVoid?: () => void;
  } = {},
) => {
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [cursor, setCursor] = useState('auto');

  const onMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  const onSourceData = useCallback((event: MapSourceDataEvent) => {
    if (event.sourceId.includes('Cluster') && event.isSourceLoaded) {
      cacheClustersGeoJson(event.sourceId);
    }
  }, []);

  const onMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      if (!isMapLoaded) return;

      const feature = event.features?.[0];
      if (!feature) {
        opts.onMouseMovedToVoid?.();
        setCursor('auto');
        return;
      }
      if (isCursorInteractableLayer(feature.layer.id)) {
        setCursor('pointer');
      }
      opts.onMouseMovedToFeature?.(feature);
    },
    [isMapLoaded, opts],
  );

  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      if (!isMapLoaded) return;

      const feature = event.features?.[0];
      if (!feature) {
        opts.onClickedToVoid?.();
        return;
      }
      const clusterId = feature?.properties?.cluster_id;
      if (clusterId && opts.clusterSourceId) {
        const mapboxSource = mapRef.current?.getSource(
          opts.clusterSourceId,
        ) as GeoJSONSource;
        mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) {
            return;
          }
          const coordinates = (feature.geometry as Point).coordinates;
          flyMapTo(mapRef, [coordinates[0], coordinates[1]], { zoom });
        });
      } else {
        opts.onClickedToFeature?.(feature);
      }
    },
    [isMapLoaded, mapRef, opts],
  );

  return { onMapLoad, isMapLoaded, onSourceData, onMouseMove, onClick, cursor };
};
