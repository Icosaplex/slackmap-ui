import React from 'react';
import { Source, Layer } from 'react-map-gl';
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
}

export const MapSources = (props: Props) => {
  const isJoinedClusters = props.options.lines && props.options.spots;
  return (
    <>
      {isJoinedClusters && (
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

      {props.options.spots && (
        <>
          {!isJoinedClusters && (
            <Source
              id="spotPoints"
              type="geojson"
              data={geoJsonURL.spotPoints}
              cluster={true}
              clusterMaxZoom={13}
              clusterMinPoints={3}
              clusterRadius={50}
              generateId={true}
              clusterProperties={{
                ft: [
                  ['get', 'ft'],
                  ['get', 'ft'],
                ],
              }}
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
            filter={false}
          >
            <Layer
              {...polygonLayer}
              //   beforeId={props.options.lines ? 'line' : undefined}
            />
            <Layer {...polygonOutlineLayer} />
            <Layer {...polygonLabelLayer} />
          </Source>
        </>
      )}
      {props.options.lines && (
        <>
          {!isJoinedClusters && (
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
          <Source
            id="lines"
            type="geojson"
            data={geoJsonURL.lines}
            generateId={true}
          >
            <Layer {...lineLayer} />
            <Layer {...lineLabelLayer} />
          </Source>
        </>
      )}
    </>
  );
};
