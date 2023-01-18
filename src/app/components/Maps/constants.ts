export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export const defaultMapViewState = {
  latitude: 35.92263245263329,
  longitude: -39.41644394307363,
  zoom: 1,
  bearing: 0,
  pitch: 0,
};

const baseUrl = 'https://d1hbfm0s717r1n.cloudfront.net';

export const geoJsonURL = {
  linePoints: baseUrl + '/geojson/lines/points.geojson',
  lines: baseUrl + '/geojson/lines/main.geojson',
  spotPoints: baseUrl + '/geojson/spots/points.geojson',
  spots: baseUrl + '/geojson/spots/main.geojson',
  clustersMain: baseUrl + '/geojson/clusters/main.geojson',
  communities:
    'https://raw.githubusercontent.com/International-Slackline-Association/slackline-data/master/communities/communities.geojson',
};

export const mapStyles = {
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
};
