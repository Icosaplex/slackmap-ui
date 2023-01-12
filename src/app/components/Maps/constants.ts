export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export const defaultMapViewState = {
  latitude: 35.92263245263329,
  longitude: -39.41644394307363,
  zoom: 1,
  bearing: 0,
  pitch: 0,
};

export const geoJsonURL = {
  linePoints:
    'https://d1hbfm0s717r1n.cloudfront.net/geojson/lines/points.geojson',
  lines: 'https://d1hbfm0s717r1n.cloudfront.net/geojson/lines/main.geojson',
  spotPoints:
    'https://d1hbfm0s717r1n.cloudfront.net/geojson/spots/points.geojson',
  spots: 'https://d1hbfm0s717r1n.cloudfront.net/geojson/spots/main.geojson',
  clustersMain:
    'https://d1hbfm0s717r1n.cloudfront.net/geojson/clusters/main.geojson',
};

export const mapStyles = {
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
};
