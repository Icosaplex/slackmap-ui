import React, { useEffect } from 'react';
import { Source, Layer, useMap } from 'react-map-gl';
import { LegendOptions } from './Components/MapLegend';
import { geoJsonURL } from './constants';
import {
  clusterCountLayer,
  clusterLayer,
  lineLabelLayer,
  lineLayer,
  polygonLabelLayer,
  polygonLayer,
  polygonOutlineLayer,
  unclusteredPointLayer,
} from './layers';

interface Props {
  options: LegendOptions;
  disableClustering?: boolean;
  filterId?: string;
}

export const MapSources = (props: Props) => {
  const { disableClustering, options, filterId } = props;
  let clusterGeoJsonUrl = '';
  const isJoinedClustering = options.lines && options.spots;

  if (!disableClustering) {
    if (options.lines && options.spots) {
      clusterGeoJsonUrl = geoJsonURL.clustersMain;
    } else if (options.spots) {
      clusterGeoJsonUrl = geoJsonURL.spotPoints;
    } else if (options.lines) {
      clusterGeoJsonUrl = geoJsonURL.linePoints;
    }
  }

  return (
    <>
      {clusterGeoJsonUrl && (
        <Source
          key={clusterGeoJsonUrl}
          id="clusterPoints"
          type="geojson"
          data={clusterGeoJsonUrl}
          cluster={true}
          clusterMaxZoom={13}
          clusterMinPoints={3}
          clusterRadius={50}
          generateId={true}
          clusterProperties={
            isJoinedClustering
              ? {
                  ft: ['max', ['get', 'ft2']],
                }
              : {
                  ft: [
                    ['get', 'ft'],
                    ['get', 'ft'],
                  ],
                }
          }
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      )}

      <Source
        id="spots"
        type="geojson"
        data={geoJsonURL.spots}
        generateId={true}
        promoteId="id"
        filter={filterId ? ['!=', ['get', 'id'], filterId] : undefined}
      >
        <Layer
          {...polygonLayer}
          layout={{
            ...polygonLayer.layout,
            visibility: options.spots ? 'visible' : 'none',
          }}
        />
        <Layer
          {...polygonOutlineLayer}
          layout={{
            ...polygonOutlineLayer.layout,
            visibility: options.spots ? 'visible' : 'none',
          }}
        />
        <Layer
          {...polygonLabelLayer}
          layout={{
            ...polygonLabelLayer.layout,
            visibility: options.spots ? 'visible' : 'none',
          }}
        />
      </Source>

      <Source
        id="lines"
        type="geojson"
        data={geoJsonURL.lines}
        generateId
        promoteId="id"
        filter={filterId ? ['!=', ['get', 'id'], filterId] : undefined}
      >
        <Layer
          {...lineLayer}
          layout={{
            ...lineLayer.layout,
            visibility: options.lines ? 'visible' : 'none',
          }}
          // filter={['all', lineLayer.filter, ['!=', ['id'], excludeId || null]]}
        />
        <Layer
          {...lineLabelLayer}
          layout={{
            ...lineLabelLayer.layout,
            visibility: options.lines ? 'visible' : 'none',
          }}
          // filter={[
          //   'all',
          //   lineLabelLayer.filter,
          //   ['!=', ['id'], excludeId || null],
          // ]}
        />
      </Source>
    </>
  );
};
