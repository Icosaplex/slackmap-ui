import {
  bbox,
  bboxPolygon,
  center,
  centerOfMass,
  circle,
  round,
} from '@turf/turf';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import {
  lineLayer,
  lineLabelLayer,
  polygonLayer,
  polygonLabelLayer,
} from './layers';
import mapboxgl from 'mapbox-gl';

// FIX: https://github.com/visgl/react-map-gl/issues/1266
// @ts-ignore
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

export const mapUrlSearchParams = {
  parse: (searchParams: URLSearchParams) => {
    const [longitude, latitude, zoom] =
      searchParams.get('map')?.split(',').map(Number) ?? [];
    if (!longitude || !latitude || !zoom) {
      return undefined;
    }
    return {
      longitude,
      latitude,
      zoom,
    };
  },
  stringify: (longitude: number, latitude: number, zoom: number) => {
    return `${round(longitude, 5)},${round(latitude, 5)},${round(zoom, 5)}`;
  },
};

export const parseMapFeature = (feature: MapboxGeoJSONFeature) => {
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
  const center = centerOfMass(feature).geometry.coordinates;
  return { originalId, type, center };
};

export const calculateBounds = (geojson: any, length?: number) => {
  const radius = length ? length / 1000 : 0.5;
  console.log(radius);
  const exactBounds = bbox(geojson) as [number, number, number, number];
  const marginedBounds = bbox(
    circle(centerOfMass(bboxPolygon(exactBounds)), radius, { steps: 4 }),
  ) as [number, number, number, number];

  console.log(
    JSON.stringify(
      circle(centerOfMass(bboxPolygon(exactBounds)), radius, { steps: 4 }),
    ),
  );
  return { exactBounds, marginedBounds };
};
