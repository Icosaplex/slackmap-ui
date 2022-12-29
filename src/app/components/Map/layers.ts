import { colors } from '@mui/material';
import type { LayerProps } from 'react-map-gl';
import { appColors } from 'styles/theme/colors';

export const lineLayer: LayerProps = {
  id: 'line',
  type: 'line',
  source: 'main',
  minzoom: 13,
  filter: ['==', ['geometry-type'], 'LineString'],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-color': appColors.lineStrokeColor,
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'isSelected'], false],
      6,
      ['boolean', ['feature-state', 'hover'], false],
      4,
      2,
    ],
    'line-opacity': [
      'case',
      [
        'boolean',
        ['feature-state', 'hover'],
        ['feature-state', 'isSelected'],
        false,
      ],
      1,
      0.8,
    ],
  },
};

export const polygonOutlineLayer: LayerProps = {
  id: 'spot-outline',
  type: 'line',
  source: 'main',
  minzoom: 13,
  maxzoom: 15,
  filter: ['==', ['geometry-type'], 'Polygon'],
  paint: {
    'line-color': appColors.lineStrokeColor,
    'line-width': 2,
    'line-opacity': 0.8,
  },
};

export const polygonLayer: LayerProps = {
  id: 'spot',
  type: 'fill',
  source: 'main',
  minzoom: 13,
  filter: ['==', ['geometry-type'], 'Polygon'],
  paint: {
    'fill-color': appColors.spotFillColor,
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'isSelected'], false],
      1,
      ['boolean', ['feature-state', 'hover'], false],
      0.8,
      0.6,
    ],
  },
};

export const polygonLabelLayer: LayerProps = {
  id: 'polygonLabel',
  type: 'symbol',
  source: 'main',
  minzoom: 15,
  filter: ['==', ['geometry-type'], 'Polygon'],
  layout: {
    'icon-image': 'marker',
    'symbol-placement': 'line-center',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-field': 'Spot',
    // 'text-size': ['interpolate', ['linear'], ['zoom'], 14, 8, 16, 12, 18, 18],
    // 'icon-size': ['interpolate', ['linear'], ['zoom'], 13, 0.2, 15, 0.5, 24, 1],
    // 'icon-anchor': 'bottom',
    // 'text-anchor': 'bottom',
    'icon-text-fit': 'both',
    'icon-text-fit-padding': [8, 8, 8, 8],
    // 'text-offset': [0, -0.5],
  },
  paint: {
    'text-color': 'white',
    'icon-color': appColors.spotFillColor,
    'icon-opacity': 0.8,
    // 'text-halo-color': 'white',
    // 'text-halo-width': 1,
  },
};

export const lineLabelLayer: LayerProps = {
  id: 'lineLabel',
  type: 'symbol',
  source: 'main',
  minzoom: 15,
  filter: ['==', ['geometry-type'], 'LineString'],
  layout: {
    'icon-image': 'marker',
    'symbol-placement': 'line-center',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-field': '{l}m',
    'text-size': 12,
    // 'text-size': ['interpolate', ['linear'], ['zoom'], 14, 8, 16, 12, 18, 18],
    // 'icon-size': ['interpolate', ['linear'], ['zoom'], 13, 0.2, 15, 0.5, 24, 1],
    // 'icon-anchor': 'bottom',
    // 'text-anchor': 'bottom',
    'icon-text-fit': 'both',
    'icon-text-fit-padding': [8, 8, 8, 8],
  },
  paint: {
    'text-color': 'white',
    'icon-color': appColors.lineStrokeColor,
    'icon-opacity': [
      'case',
      [
        'boolean',
        ['feature-state', 'hover'],
        ['feature-state', 'isSelected'],
        false,
      ],
      1,
      0.8,
    ],
    // 'text-halo-color': 'white',
    // 'text-halo-width': 1,
  },
};

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'points',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      colors.green[300],
      50,
      colors.green[600],
      200,
      colors.green[900],
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      20,
      50,
      25,
      200,
      30,
      400,
      35,
    ],
  },
};

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'points',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'points',
  maxzoom: 13,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': appColors.slacklinePoint,
    'circle-radius': 6,
    'circle-stroke-width': 1,
    'circle-stroke-color': appColors.lineStrokeColor,
  },
};
