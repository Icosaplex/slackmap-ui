import { darken, lighten } from '@mui/material';
import {
  CircleLayout,
  CirclePaint,
  FillLayout,
  FillPaint,
  LineLayout,
  LinePaint,
  SymbolLayout,
  SymbolPaint,
} from 'mapbox-gl';
import type {
  CircleLayer,
  FillLayer,
  LayerProps,
  LineLayer,
  SymbolLayer,
} from 'react-map-gl';
import { appColors } from 'styles/theme/colors';

type FeatureLayerType =
  | 'line'
  | 'spot'
  | 'guide'
  | 'slacklineGroup'
  | 'managedArea';

export const pointLayer = (
  type: FeatureLayerType,
  layout?: CircleLayout,
): CircleLayer => ({
  id: 'point' + (type ? `-${type}` : ''),
  type: 'circle',
  filter: [
    'any',
    ['==', ['geometry-type'], 'Point'],
    ['==', ['geometry-type'], 'MultiPoint'],
  ],

  layout: {
    ...layout,
  },
  paint: {
    'circle-radius': [
      'case',
      [
        'any',
        ['boolean', ['feature-state', 'isSelected'], false],
        ['boolean', ['feature-state', 'isFocused'], false],
      ],
      12,
      ['boolean', ['feature-state', 'hover'], false],
      9,
      7,
    ],
    'circle-opacity': 0.8,
    'circle-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      ['==', ['get', 'ft'], 'sg'],
      appColors.isaBlue,
      appColors.lineStrokeColor,
    ],
    'circle-stroke-width': 1,
    'circle-stroke-color': 'white',
  },
});

export const pointLabelLayer = (
  type: FeatureLayerType,
  layout?: SymbolLayout,
): SymbolLayer => ({
  id: 'pointLabel' + (type ? `-${type}` : ''),
  type: 'symbol',
  minzoom: 13,
  filter: ['all', ['==', ['geometry-type'], 'Point'], ['has', 'l']],
  layout: {
    'icon-image': 'marker',
    'symbol-placement': 'point',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-field': '{l}',
    'icon-text-fit': 'both',
    'icon-allow-overlap': true,
    'text-allow-overlap': true,
    'icon-text-fit-padding': [8, 8, 8, 8],
    ...layout,
  },
  paint: {
    'text-color': 'white',
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
    'icon-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      appColors.lineStrokeColor,
    ],
  },
});

export const lineLayer = (
  type: FeatureLayerType,
  layout?: LineLayout,
): LineLayer => ({
  id: 'line' + (type ? `-${type}` : ''),
  type: 'line',
  minzoom: 12,
  filter: ['==', ['geometry-type'], 'LineString'],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
    ...layout,
  },
  paint: {
    'line-width': [
      'case',
      [
        'any',
        ['boolean', ['feature-state', 'isSelected'], false],
        ['boolean', ['feature-state', 'isFocused'], false],
      ],
      6,
      ['boolean', ['feature-state', 'hover'], false],
      4,
      ['==', ['get', 'ft'], 'g'],
      3,
      2,
    ],
    'line-opacity': [
      'case',
      [
        'boolean',
        ['feature-state', 'hover'],
        ['feature-state', 'isSelected'],
        ['feature-state', 'isFocused'],
        ['==', ['get', 'ft'], 'g'],
        false,
      ],
      1,
      0.8,
    ],
    'line-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      appColors.lineStrokeColor,
    ],
    'line-dasharray': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      ['literal', [0.4, 2]],
      ['literal', [1]],
    ],
  },
});

export const lineLabelLayer = (
  type: FeatureLayerType,
  layout?: SymbolLayout,
): SymbolLayer => ({
  id: 'lineLabel' + (type ? `-${type}` : ''),
  type: 'symbol',
  minzoom: 14,
  filter: ['all', ['==', ['geometry-type'], 'LineString'], ['has', 'l']],
  layout: {
    'icon-image': 'marker',
    'symbol-placement': 'line-center',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-field': '{l}',
    'text-size': 12,
    'icon-allow-overlap': true,
    'text-allow-overlap': true,
    'icon-text-fit': 'both',
    'icon-text-fit-padding': [8, 8, 8, 8],
    ...layout,
  },
  paint: {
    'text-color': 'white',
    'icon-opacity': [
      'case',
      [
        'boolean',
        ['feature-state', 'hover'],
        ['feature-state', 'isSelected'],
        ['feature-state', 'isFocused'],
        false,
      ],
      1,
      0.8,
    ],
    'icon-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      appColors.lineStrokeColor,
    ],
  },
});

export const polygonLayer = (
  type: FeatureLayerType,
  layout?: FillLayout,
  opacity?: 'low' | 'high',
): FillLayer => ({
  id: 'polygon' + (type ? `-${type}` : ''),
  type: 'fill',
  minzoom: 12,
  filter: [
    'any',
    ['==', ['geometry-type'], 'Polygon'],
    ['==', ['geometry-type'], 'MultiPolygon'],
  ],
  layout: {
    ...layout,
  },
  paint: {
    'fill-opacity': [
      'case',
      [
        'any',
        ['boolean', ['feature-state', 'isSelected'], false],
        ['boolean', ['feature-state', 'isFocused'], false],
      ],
      0.8,
      ['boolean', ['feature-state', 'hover'], false],
      opacity === 'high' ? 0.8 : 0.6,
      opacity === 'high' ? 0.4 : 0.2,
    ],
    'fill-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      ['==', ['get', 'ft'], 'ma'],
      appColors.isaBlue,
      appColors.spotFillColor,
    ],
  },
});

export const polygonOutlineLayer = (
  type: FeatureLayerType,
  layout?: LineLayout,
): LineLayer => ({
  id: 'polygonOutline' + (type ? `-${type}` : ''),
  type: 'line',
  minzoom: 12,
  filter: ['==', ['geometry-type'], 'Polygon'],
  layout: {
    ...layout,
  },
  paint: {
    'line-width': 2,
    'line-opacity': 1,
    'line-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      appColors.spotFillColor,
    ],
    'line-dasharray': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      ['literal', [0.4, 2]],
      ['literal', [1]],
    ],
  },
});

export const polygonLabelLayer = (
  type: FeatureLayerType,
  layout?: SymbolLayout,
): SymbolLayer => ({
  id: 'polygonLabel' + (type ? `-${type}` : ''),
  type: 'symbol',
  minzoom: 13,
  filter: ['all', ['==', ['geometry-type'], 'Polygon'], ['has', 'l']],
  layout: {
    'icon-image': 'marker',
    'symbol-placement': 'line-center',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-field': '{l}',
    'icon-text-fit': 'both',
    'icon-allow-overlap': true,
    'text-allow-overlap': true,
    'icon-text-fit-padding': [8, 8, 8, 8],
    ...layout,
  },
  paint: {
    'text-color': 'white',
    'icon-opacity': 0.8,
    'icon-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      appColors.spotFillColor,
    ],
  },
});

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      [
        'case',
        ['==', ['get', 'ft'], 'g'],
        lighten(appColors.guideFeaturesColor, 0.3),
        ['==', ['get', 'ft'], 's'],
        lighten(appColors.spotFillColor, 0.3),
        ['==', ['get', 'ft'], 'l'],
        lighten(appColors.lineStrokeColor, 0.3),
        lighten(appColors.mainClusterColor, 0.2),
      ],
      50,
      [
        'case',
        ['==', ['get', 'ft'], 'g'],
        appColors.guideFeaturesColor,
        ['==', ['get', 'ft'], 's'],
        appColors.spotFillColor,
        ['==', ['get', 'ft'], 'l'],
        appColors.lineStrokeColor,
        appColors.mainClusterColor,
      ],
      200,
      [
        'case',
        ['==', ['get', 'ft'], 'g'],
        darken(appColors.guideFeaturesColor, 0.3),
        ['==', ['get', 'ft'], 's'],
        darken(appColors.spotFillColor, 0.3),
        ['==', ['get', 'ft'], 'l'],
        darken(appColors.lineStrokeColor, 0.3),
        darken(appColors.mainClusterColor, 0.3),
      ],
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
  id: 'clusterCount',
  type: 'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
};

export const unclusteredPointLayer: CircleLayer = {
  id: 'unclusteredPoint',
  type: 'circle',
  maxzoom: 13,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      ['==', ['get', 'ft'], 's'],
      appColors.spotFillColor,
      ['==', ['get', 'ft'], 'l'],
      appColors.lineStrokeColor,
      appColors.slackmapGreen,
    ],
    'circle-radius': 6,
    'circle-stroke-width': 1,
    'circle-stroke-color': 'white',
  },
};

const cursorInteractableLayerIds = [
  pointLayer('slacklineGroup').id,
  polygonLayer('managedArea').id,
  pointLayer('guide').id,
  pointLabelLayer('guide').id,
  lineLayer('line').id,
  lineLayer('guide').id,
  lineLabelLayer('line').id,
  lineLabelLayer('guide').id,
  polygonLayer('spot').id,
  polygonLayer('guide').id,
  unclusteredPointLayer.id!,
  clusterLayer.id!,
];

const mouseHoverableLayersIds = [
  pointLayer('slacklineGroup').id,
  polygonLayer('managedArea').id,
  pointLayer('guide').id,
  pointLabelLayer('guide').id,
  lineLayer('line').id,
  lineLayer('guide').id,
  lineLabelLayer('line').id,
  lineLabelLayer('guide').id,
  polygonLayer('spot').id,
  polygonLayer('guide').id,
];

export const isMouseHoverableLayer = (layerId: string) =>
  mouseHoverableLayersIds.includes(layerId);

export const isCursorInteractableLayer = (layerId: string) =>
  cursorInteractableLayerIds.includes(layerId);
