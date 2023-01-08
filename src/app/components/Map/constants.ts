export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export const defaultMapViewState = {
  latitude: 35.92263245263329,
  longitude: -39.41644394307363,
  zoom: 1,
  bearing: 0,
  pitch: 0,
};

export const geoJsonURL = {
  points: 'https://d1hbfm0s717r1n.cloudfront.net/geojson/points.geojson',
  main: 'https://d1hbfm0s717r1n.cloudfront.net/geojson/main.geojson',
};
