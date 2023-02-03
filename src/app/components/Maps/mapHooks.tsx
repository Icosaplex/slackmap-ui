import { Point, Position } from 'geojson';
import {
  GeoJSONSource,
  MapboxGeoJSONFeature,
  MapLayerMouseEvent,
  MapSourceDataEvent,
} from 'mapbox-gl';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { MapRef } from 'react-map-gl';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { LegendMenuItem } from './Components/MapLegend';
import { isCursorInteractableLayer } from './layers';
import {
  cacheClustersGeoJson,
  flyMapTo,
  parseMapFeature,
  zoomToUserLocation,
} from './mapUtils';

type MapRefType = RefObject<MapRef>;

export const useLegendMenu = <
  T extends {
    [key: string]: {
      label: string;
      isSelected?: boolean;
      isDisabled?: boolean;
    };
  },
>(
  options: T,
) => {
  const legendMenu: {
    key: keyof T;
    label: string;
    isSelected?: boolean;
    isDisabled?: boolean;
  }[] = [];
  const legendValuesDefault: { [key in keyof T]: boolean | undefined } =
    {} as any;
  for (const [key, value] of Object.entries(options)) {
    legendValuesDefault[key as keyof T] = value.isSelected;
    legendMenu.push({
      key,
      label: value.label,
      isSelected: value.isSelected,
      isDisabled: value.isDisabled,
    });
  }

  const [legendValues, setLegendValues] = useState(legendValuesDefault);

  const onLegendItemsUpdated = (items: LegendMenuItem[]) => {
    setLegendValues(prev => {
      const newValues = { ...prev };
      for (const item of items) {
        newValues[item.key as keyof T] = item.isSelected;
      }
      return newValues;
    });
  };

  return { legendValues, legendMenu, onLegendItemsUpdated };
};

export const useZoomToUserLocationOnMapLoad = (
  mapRef: MapRefType,
  shouldZoom?: boolean,
) => {
  const { isDesktop } = useMediaQuery();
  const [hasAlreadyZoomed, setHasAlreadyZoomed] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !shouldZoom || hasAlreadyZoomed) return;
    zoomToUserLocation(mapRef, { zoom: isDesktop ? 2.5 : 1.5 });
    setHasAlreadyZoomed(true);
  }, [isDesktop, shouldZoom, mapRef, hasAlreadyZoomed]);
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
    if (
      event.sourceId.toLowerCase().includes('cluster') &&
      event.isSourceLoaded
    ) {
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

  const onMapClick = useCallback(
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

  return {
    onMapLoad,
    isMapLoaded,
    onSourceData,
    onMouseMove,
    onMapClick,
    cursor,
  };
};
