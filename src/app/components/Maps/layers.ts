import { darken, lighten } from '@mui/material';
import type { LayerProps } from 'react-map-gl';
import { appColors } from 'styles/theme/colors';

export const pointLayer: LayerProps = {
  id: 'point',
  type: 'circle',
  // source: 'main',
  filter: ['==', ['geometry-type'], 'Point'],
  paint: {
    'circle-radius': 7,
    'circle-opacity': 0.8,
    'circle-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      appColors.lineStrokeColor,
    ],
  },
};

export const pointLabelLayer: LayerProps = {
  id: 'pointLabel',
  type: 'symbol',
  // source: 'main',
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
};

export const lineLayer: LayerProps = {
  id: 'line',
  type: 'line',
  // source: 'main',
  minzoom: 12,
  filter: ['==', ['geometry-type'], 'LineString'],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
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
};

export const lineLabelLayer: LayerProps = {
  id: 'lineLabel',
  type: 'symbol',
  // source: 'main',
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
};

export const polygonLayer: LayerProps = {
  // beforeId: 'line',
  id: 'polygon',
  type: 'fill',
  // source: 'main',
  minzoom: 12,
  filter: ['==', ['geometry-type'], 'Polygon'],
  paint: {
    'fill-opacity': [
      'case',
      [
        'any',
        ['boolean', ['feature-state', 'isSelected'], false],
        ['boolean', ['feature-state', 'isFocused'], false],
      ],
      1,
      ['boolean', ['feature-state', 'hover'], false],
      0.8,
      0.6,
    ],
    'fill-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      appColors.spotFillColor,
    ],
  },
};

export const polygonOutlineLayer: LayerProps = {
  id: 'polygonOutline',
  type: 'line',
  // source: 'main',
  minzoom: 13,
  maxzoom: 15,
  filter: ['==', ['geometry-type'], 'Polygon'],
  paint: {
    'line-color': appColors.lineStrokeColor,
    'line-width': 2,
    'line-opacity': 0.8,
  },
};

export const polygonLabelLayer: LayerProps = {
  id: 'polygonLabel',
  type: 'symbol',
  // source: 'main',
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
    'icon-opacity': 0.8,
    'icon-color': [
      'case',
      ['==', ['get', 'ft'], 'g'],
      appColors.guideFeaturesColor,
      appColors.spotFillColor,
    ],
  },
};

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
        lighten(appColors.guideFeaturesColor, 0.2),
        ['==', ['get', 'ft'], 's'],
        lighten(appColors.spotFillColor, 0.2),
        ['==', ['get', 'ft'], 'l'],
        lighten(appColors.lineStrokeColor, 0.2),
        lighten(appColors.slackmapGreen, 0.2),
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
        appColors.slackmapGreen,
      ],
      200,
      [
        'case',
        ['==', ['get', 'ft'], 'g'],
        darken(appColors.guideFeaturesColor, 0.2),
        ['==', ['get', 'ft'], 's'],
        darken(appColors.spotFillColor, 0.2),
        ['==', ['get', 'ft'], 'l'],
        darken(appColors.lineStrokeColor, 0.2),
        darken(appColors.slackmapGreen, 0.2),
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
  source: 'points',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: 'unclusteredPoint',
  type: 'circle',
  source: 'points',
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

export const layers = {
  // lineDisabled: (() => {
  //   const layer = cloneDeep(lineLayerBase);
  //   layer.id = 'lineDisabled';
  //   layer.paint!['line-opacity'] = 0.5;
  //   return layer;
  // })(),
  // lineLabelDisabled: (() => {
  //   const layer = cloneDeep(lineLabelLayerBase);
  //   layer.id = 'lineLabelDisabled';
  //   layer.paint!['icon-opacity'] = 0.5;
  //   return layer;
  // })(),
  // polygonDisabled: (() => {
  //   const layer = cloneDeep(polygonLayerBase);
  //   layer.id = 'polygonDisabled';
  //   layer.paint!['fill-opacity'] = 0.5;
  //   return layer;
  // })(),
  // lineFocused: (() => {
  //   const layer = cloneDeep(lineLayerBase);
  //   layer.id = 'lineFocused';
  //   layer.paint!['line-width'] = 6;
  //   return layer;
  // })(),
  // lineLabelFocused: (() => {
  //   const layer = cloneDeep(lineLabelLayerBase);
  //   layer.id = 'lineLabelFocused';
  //   return layer;
  // })(),
  // spotFocused: (() => {
  //   const layer = cloneDeep(polygonLayerBase);
  //   layer.id = 'polygonFocused';
  //   return layer;
  // })(),
  // cluster: clusterLayer,
  // clusterCount: clusterCountLayer,
  // unclusteredPoint: unclusteredPointLayer,
};

export const cursorInteractableLayerIds = [
  lineLayer.id!,
  lineLabelLayer.id!,
  polygonLayer.id!,
  unclusteredPointLayer.id!,
  clusterLayer.id!,
];

export const mouseHoverableLayersIds = [
  lineLayer.id!,
  lineLabelLayer.id!,
  polygonLayer.id!,
];
