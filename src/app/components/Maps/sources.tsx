import React, { useEffect } from 'react';
import { Source, Layer, useMap } from 'react-map-gl';
import { appColors } from 'styles/theme/colors';
import { geoJsonURL } from './constants';
import {
  clusterCountLayer,
  clusterLayer,
  lineLabelLayer,
  lineLayer,
  pointLabelLayer,
  pointLayer,
  polygonLabelLayer,
  polygonLayer,
  polygonOutlineLayer,
  unclusteredPointLayer,
} from './layers';

export const SlacklineMapSources = (props: {
  options: {
    spots?: boolean;
    lines?: boolean;
    guides?: boolean;
  };
  disableClustering?: boolean;
  filterId?: string;
}) => {
  const { disableClustering, options, filterId } = props;
  let clusterGeoJsonUrl = '';
  const isJoinedClustering =
    [options.lines, options.spots, options.guides].filter(Boolean).length > 1;

  if (!disableClustering) {
    if (options.lines && options.spots && options.guides) {
      clusterGeoJsonUrl = geoJsonURL.clustersAll;
    } else if (options.lines && options.spots) {
      clusterGeoJsonUrl = geoJsonURL.clustersLinesSpots;
    } else if (options.lines && options.guides) {
      clusterGeoJsonUrl = geoJsonURL.clustersLinesGuides;
    } else if (options.spots && options.guides) {
      clusterGeoJsonUrl = geoJsonURL.clustersSpotsGuides;
    } else if (options.lines) {
      clusterGeoJsonUrl = geoJsonURL.linePoints;
    } else if (options.spots) {
      clusterGeoJsonUrl = geoJsonURL.spotPoints;
    } else if (options.guides) {
      clusterGeoJsonUrl = geoJsonURL.guidePoints;
    }
  }

  return (
    <>
      {clusterGeoJsonUrl && (
        <Source
          key={clusterGeoJsonUrl}
          id="slacklineMapCluster"
          type="geojson"
          data={clusterGeoJsonUrl}
          cluster={true}
          clusterMaxZoom={13}
          clusterMinPoints={3}
          clusterRadius={60}
          generateId={true}
          clusterProperties={
            isJoinedClustering
              ? undefined
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
        id="guides"
        type="geojson"
        data={geoJsonURL.guides}
        generateId={true}
        promoteId="id"
        filter={filterId ? ['!=', ['get', 'id'], filterId] : undefined}
      >
        <Layer
          {...polygonLayer('guide', {
            visibility: options.guides ? 'visible' : 'none',
          })}
        />

        <Layer
          {...polygonOutlineLayer('guide', {
            visibility: options.guides ? 'visible' : 'none',
          })}
        />

        <Layer
          {...polygonLabelLayer('guide', {
            visibility: options.guides ? 'visible' : 'none',
          })}
        />

        <Layer
          {...lineLayer('guide', {
            visibility: options.guides ? 'visible' : 'none',
          })}
        />

        <Layer
          {...lineLabelLayer('guide', {
            visibility: options.guides ? 'visible' : 'none',
          })}
        />

        <Layer
          {...pointLayer('guide', {
            visibility: options.guides ? 'visible' : 'none',
          })}
        />
        <Layer
          {...pointLabelLayer('guide', {
            visibility: options.guides ? 'visible' : 'none',
          })}
        />
      </Source>

      <Source
        id="spots"
        type="geojson"
        data={geoJsonURL.spots}
        generateId={true}
        promoteId="id"
        filter={filterId ? ['!=', ['get', 'id'], filterId] : undefined}
      >
        <Layer
          {...polygonLayer('spot', {
            visibility: options.spots ? 'visible' : 'none',
          })}
        />
        <Layer
          {...polygonOutlineLayer('spot', {
            visibility: options.spots ? 'visible' : 'none',
          })}
        />
        <Layer
          {...polygonLabelLayer('spot', {
            visibility: options.spots ? 'visible' : 'none',
          })}
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
          {...lineLayer('line', {
            visibility: options.lines ? 'visible' : 'none',
          })}
          // filter={['all', lineLayer.filter, ['!=', ['id'], excludeId || null]]}
        />
        <Layer
          {...lineLabelLayer('line', {
            visibility: options.lines ? 'visible' : 'none',
          })}
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

export const CommunityMapSources = (props: {
  options: {
    groups?: boolean;
    organizations?: boolean;
  };
}) => {
  return (
    <>
      <Source
        id="slacklineGroups"
        type="geojson"
        data={geoJsonURL.groups}
        generateId={true}
        promoteId="id"
      >
        <Layer
          {...pointLayer('slacklineGroup', {
            visibility: props.options.groups ? 'visible' : 'none',
          })}
        />
      </Source>
      <Source
        id="countryOrganizations"
        type="geojson"
        data={geoJsonURL.organizations}
        generateId={true}
        promoteId="id"
      >
        <Layer
          {...polygonLayer('countryOrganization', {
            visibility: props.options.organizations ? 'visible' : 'none',
          })}
          minzoom={0}
        />
      </Source>
    </>
  );
};
