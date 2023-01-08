import {
  bbox,
  bboxPolygon,
  center,
  centerOfMass,
  circle,
  Feature,
  featureEach,
  Point,
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
import { geoJsonURL } from './constants';

// FIX: https://github.com/visgl/react-map-gl/issues/1266
// @ts-ignore
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

export let pointsGeoJsonDict: { [key: string]: Feature<Point> } = {};
// This http get will directly get from browser cache. Its only called after Mapbox Loaded the source.
// Clustered points have buggy coordinates, so we need to get the original coordinates from the geojson.
export const cachePointsGeoJson = async () => {
  const response = await fetch(geoJsonURL.points).then(r => r.json());
  if (response) {
    featureEach<Point>(response, pointFeature => {
      pointsGeoJsonDict[pointFeature.properties?.id] = pointFeature;
    });
  }
};

export const mapUrlSearchParams = {
  parse: (searchParams: URLSearchParams) => {
    const [longitude, latitude, zoom] =
      searchParams
        .get('map')
        ?.split(',')
        .map(p => {
          const parsed = parseFloat(p);
          return isNaN(parsed) ? undefined : parsed;
        }) ?? [];

    if (longitude === undefined || latitude === undefined) {
      return undefined;
    }
    return {
      longitude,
      latitude,
      zoom: zoom || 0,
    };
  },
  stringify: (longitude: number, latitude: number, zoom: number) => {
    return `${round(longitude, 5)},${round(latitude, 5)}${
      zoom ? `,${round(zoom, 5)}` : ''
    }`;
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


export const calculateBounds = (
  geojson: any,
  length?: number,
  pad?: number,
) => {
  const radius = length ? (length * (pad ?? 1)) / 1000 : 0.3;
  const exactBounds = bbox(geojson) as [number, number, number, number];
  const marginedBounds = bbox(
    circle(center(bboxPolygon(exactBounds)), radius, { steps: 4 }),
  ) as [number, number, number, number];

  // console.log(
  //   JSON.stringify(
  //     circle(center(bboxPolygon(exactBounds)), radius, { steps: 4 }),
  //   ),
  // );
  return { exactBounds, marginedBounds };
};
