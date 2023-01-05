import { colors } from '@mui/material';
import type { LayerProps } from 'react-map-gl';
import { appColors } from 'styles/theme/colors';

export const lineLayerFocused: LayerProps = {
  id: 'lineFocused',
  type: 'line',
  source: 'focused',
  filter: ['==', ['geometry-type'], 'LineString'],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-color': appColors.lineStrokeColor,
    'line-width': 6,
  },
};

// export const lineLayer: LayerProps = {
//   id: 'line',
//   type: 'line',
//   source: 'world',
//   filter: ['==', ['geometry-type'], 'LineString'],
//   paint: {
//     'line-color': appColors.lineStrokeColor,
//     'line-width': 2,
//     'line-opacity': 0.5,
//   },
// };

export const polygonLayerFocused: LayerProps = {
  id: 'spotFocused',
  type: 'fill',
  source: 'focused',
  filter: ['==', ['geometry-type'], 'Polygon'],
  paint: {
    'fill-color': appColors.spotFillColor,
    'fill-opacity': 1,
  },
};

// export const polygonLayer: LayerProps = {
//   id: 'spot',
//   type: 'fill',
//   source: 'main',
//   filter: ['==', ['geometry-type'], 'Polygon'],
//   paint: {
//     'fill-color': appColors.spotFillColor,
//     'fill-opacity': 0.5,
//   },
// };

export const lineLabelLayerFocused: LayerProps = {
  id: 'lineLabelFocused',
  type: 'symbol',
  source: 'focused',
  filter: ['==', ['geometry-type'], 'LineString'],
  layout: {
    'icon-image': 'marker',
    'symbol-placement': 'line-center',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-field': '{l}m',
    'text-size': 12,
    'icon-text-fit': 'both',
    'icon-text-fit-padding': [8, 8, 8, 8],
    'icon-allow-overlap': true,
    'text-allow-overlap': true,
  },
  paint: {
    'text-color': 'white',
    'icon-color': appColors.lineStrokeColor,
    'icon-opacity': 1,
  },
};

// export const lineLabelLayer: LayerProps = {
//   id: 'lineLabel',
//   type: 'symbol',
//   source: 'main',
//   filter: ['==', ['geometry-type'], 'LineString'],
//   layout: {
//     'icon-image': 'marker',
//     'symbol-placement': 'line-center',
//     'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
//     'text-field': '{l}m',
//     'text-size': 12,
//     'icon-text-fit': 'both',
//     'icon-text-fit-padding': [8, 8, 8, 8],
//     'icon-allow-overlap': true,
//     'text-allow-overlap': true,
//   },
//   paint: {
//     'text-color': 'white',
//     'icon-color': appColors.lineStrokeColor,
//     'icon-opacity': 0.5,
//   },
// };
