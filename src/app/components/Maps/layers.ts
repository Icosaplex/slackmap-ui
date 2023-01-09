import { darken, lighten } from '@mui/material';
import type { LayerProps } from 'react-map-gl';
import { appColors } from 'styles/theme/colors';
import cloneDeep from 'lodash/cloneDeep';

const pointLayerBase: LayerProps = {
  id: 'point',
  type: 'circle',
  source: 'main',
  filter: ['==', ['geometry-type'], 'Point'],
  paint: {
    'circle-radius': 7,
    'circle-color': appColors.lineStrokeColor,
    'circle-opacity': 0.8,
  },
};

const lineLayerBase: LayerProps = {
  id: 'line',
  type: 'line',
  source: 'main',
  minzoom: 12,
  filter: ['==', ['geometry-type'], 'LineString'],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-color': appColors.lineStrokeColor,
    'line-width': 2,
  },
};

const polygonOutlineLayerBase: LayerProps = {
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

const polygonLayerBase: LayerProps = {
  id: 'spot',
  type: 'fill',
  source: 'main',
  minzoom: 12,
  filter: ['==', ['geometry-type'], 'Polygon'],
  paint: {
    'fill-color': appColors.spotFillColor,
  },
};

const polygonLabelLayerBase: LayerProps = {
  id: 'polygonLabel',
  type: 'symbol',
  source: 'main',
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
  },
  paint: {
    'text-color': 'white',
    'icon-color': appColors.spotFillColor,
    'icon-opacity': 0.8,
  },
};

const lineLabelLayerBase: LayerProps = {
  id: 'lineLabel',
  type: 'symbol',
  source: 'main',
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
  },
  paint: {
    'text-color': 'white',
    'icon-color': appColors.lineStrokeColor,
  },
};

const pointLabelLayerBase: LayerProps = {
  id: 'pointLabel',
  type: 'symbol',
  source: 'main',
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
  },
  paint: {
    'text-color': 'white',
    'icon-color': appColors.lineStrokeColor,
    'icon-opacity': 0.8,
  },
};

const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'points',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      lighten(appColors.slackmapGreen, 0.2),
      50,
      lighten(appColors.slackmapGreen, 0),
      200,
      darken(appColors.slackmapGreen, 0.2),
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

const clusterCountLayer: LayerProps = {
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

const unclusteredPointLayer: LayerProps = {
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

export const layers = {
  point: (() => {
    const layer = cloneDeep(pointLayerBase);
    layer.paint!['circle-color'] = [
      'case',
      ['==', ['get', 'ft'], 'extra'],
      appColors.extraFeaturesColor,
      appColors.lineStrokeColor,
    ];
    return layer;
  })(),

  pointLabel: (() => {
    const layer = cloneDeep(pointLabelLayerBase);
    layer.paint!['icon-opacity'] = [
      'case',
      [
        'boolean',
        ['feature-state', 'hover'],
        ['feature-state', 'isSelected'],
        false,
      ],
      1,
      0.8,
    ];
    layer.paint!['icon-color'] = [
      'case',
      ['==', ['get', 'ft'], 'extra'],
      appColors.extraFeaturesColor,
      appColors.lineStrokeColor,
    ];
    return layer;
  })(),

  line: (() => {
    const layer = cloneDeep(lineLayerBase);
    layer.paint!['line-width'] = [
      'case',
      ['boolean', ['feature-state', 'isSelected'], false],
      6,
      ['boolean', ['feature-state', 'hover'], false],
      4,
      ['==', ['get', 'ft'], 'extra'],
      3,
      2,
    ];
    layer.paint!['line-opacity'] = [
      'case',
      [
        'boolean',
        ['feature-state', 'hover'],
        ['feature-state', 'isSelected'],
        ['==', ['get', 'ft'], 'extra'],
        false,
      ],
      1,
      0.8,
    ];
    layer.paint!['line-color'] = [
      'case',
      ['==', ['get', 'ft'], 'extra'],
      appColors.extraFeaturesColor,
      appColors.lineStrokeColor,
    ];
    layer.paint!['line-dasharray'] = [
      'case',
      ['==', ['get', 'ft'], 'extra'],
      ['literal', [0.4, 2]],
      ['literal', [1]],
    ];
    return layer;
  })(),

  lineDisabled: (() => {
    const layer = cloneDeep(lineLayerBase);
    layer.id = 'lineDisabled';
    layer.paint!['line-opacity'] = 0.5;
    return layer;
  })(),

  lineLabel: (() => {
    const layer = cloneDeep(lineLabelLayerBase);
    layer.paint!['icon-opacity'] = [
      'case',
      [
        'boolean',
        ['feature-state', 'hover'],
        ['feature-state', 'isSelected'],
        false,
      ],
      1,
      0.8,
    ];
    layer.paint!['icon-color'] = [
      'case',
      ['==', ['get', 'ft'], 'extra'],
      appColors.extraFeaturesColor,
      appColors.lineStrokeColor,
    ];
    return layer;
  })(),

  lineLabelDisabled: (() => {
    const layer = cloneDeep(lineLabelLayerBase);
    layer.id = 'lineLabelDisabled';
    layer.paint!['icon-opacity'] = 0.5;
    return layer;
  })(),

  polygon: (() => {
    const layer = cloneDeep(polygonLayerBase);
    layer.paint!['fill-opacity'] = [
      'case',
      ['boolean', ['feature-state', 'isSelected'], false],
      1,
      ['boolean', ['feature-state', 'hover'], false],
      0.8,
      0.6,
    ];
    layer.paint!['fill-color'] = [
      'case',
      ['==', ['get', 'ft'], 'extra'],
      appColors.extraFeaturesColor,
      appColors.spotFillColor,
    ];
    return layer;
  })(),

  polygonDisabled: (() => {
    const layer = cloneDeep(polygonLayerBase);
    layer.id = 'polygonDisabled';
    layer.paint!['fill-opacity'] = 0.5;
    return layer;
  })(),

  polygonLabel: (() => {
    const layer = cloneDeep(polygonLabelLayerBase);
    layer.id = 'polygonLabel';
    layer.paint!['icon-color'] = [
      'case',
      ['==', ['get', 'ft'], 'extra'],
      appColors.extraFeaturesColor,
      appColors.spotFillColor,
    ];
    return layer;
  })(),

  polygonOutline: (() => {
    const layer = cloneDeep(polygonOutlineLayerBase);
    layer.id = 'polygonOutline';
    return layer;
  })(),

  lineFocused: (() => {
    const layer = cloneDeep(lineLayerBase);
    layer.id = 'lineFocused';
    layer.paint!['line-width'] = 6;
    return layer;
  })(),

  lineLabelFocused: (() => {
    const layer = cloneDeep(lineLabelLayerBase);
    layer.id = 'lineLabelFocused';
    return layer;
  })(),

  spotFocused: (() => {
    const layer = cloneDeep(polygonLayerBase);
    layer.id = 'polygonFocused';
    return layer;
  })(),

  cluster: clusterLayer,
  clusterCount: clusterCountLayer,
  unclusteredPoint: unclusteredPointLayer,
};

export const cursorInteractableLayerIds = [
  layers.line.id!,
  layers.lineLabel.id!,
  layers.polygon.id!,
  layers.unclusteredPoint.id!,
];

export const mouseHoverableLayersIds = [
  layers.lineLabel.id!,
  layers.line.id!,
  layers.polygon.id!,
];
