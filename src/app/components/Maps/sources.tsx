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
  //   excludeId?: string;
  disableClustering?: boolean;
}

export const MapSources = (props: Props) => {
  const { disableClustering, options } = props;
  const isJoinedClusters = options.lines && options.spots;

  return (
    <>
      {isJoinedClusters && !disableClustering && (
        <Source
          id="linePoints"
          type="geojson"
          data={geoJsonURL.clustersMain}
          cluster={true}
          clusterMaxZoom={13}
          clusterMinPoints={3}
          clusterRadius={50}
          generateId={true}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      )}

      {options.spots && (
        <>
          {!isJoinedClusters && !disableClustering && (
            <Source
              id="spotPoints"
              type="geojson"
              data={geoJsonURL.spotPoints}
              cluster={true}
              clusterMaxZoom={13}
              clusterMinPoints={3}
              clusterRadius={50}
              clusterProperties={{
                ft: [
                  ['get', 'ft'],
                  ['get', 'ft'],
                ],
              }}
              generateId={true}
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
          >
            <Layer {...polygonLayer} />
            <Layer {...polygonOutlineLayer} />
            <Layer {...polygonLabelLayer} />
          </Source>
        </>
      )}
      {options.lines && (
        <>
          {!isJoinedClusters && !disableClustering && (
            <Source
              id="linePoints"
              type="geojson"
              data={geoJsonURL.linePoints}
              cluster={true}
              clusterMaxZoom={13}
              clusterMinPoints={3}
              clusterRadius={50}
              clusterProperties={{
                ft: [
                  ['get', 'ft'],
                  ['get', 'ft'],
                ],
              }}
              generateId={true}
            >
              <Layer {...clusterLayer} />
              <Layer {...clusterCountLayer} />
              <Layer {...unclusteredPointLayer} />
            </Source>
          )}
          <Source id="lines" type="geojson" data={geoJsonURL.lines}>
            <Layer {...lineLayer} />
            <Layer {...lineLabelLayer} />
          </Source>
        </>
      )}
    </>
  );
};
