import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/system';
import { parseMapFeature } from 'app/components/Maps/mapUtils';
import { MapboxGeoJSONFeature } from 'react-map-gl';
import { CommunityMap } from 'app/components/Maps/CommunityMap';
import { SlacklineGroupInfoPopup } from 'app/components/Maps/Components/Popups/SlacklineGroupInfoPopup';
import { CountryOrganizationInfoPopup } from 'app/components/Maps/Components/Popups/CountryOrganizationInfoPopup';

interface Props {}

export function CommunitiesPage(props: Props) {
  const [selectedFeature, setSelectedFeature] = useState<{
    id: string;
    type: MapCommunityFeatureType;
    organizationIds?: string[];
    cn?: 'Switzerland';
  }>();

  const onSelectedFeatureChange = (feature?: MapboxGeoJSONFeature) => {
    if (!feature) return setSelectedFeature(undefined);
    const { id, type } = parseMapFeature(feature);

    if (id && typeof id === 'string' && type) {
      setSelectedFeature({
        id,
        type: type as MapCommunityFeatureType,
        cn: feature.properties?.cn,
        organizationIds:
          feature.properties?.organizationIds &&
          JSON.parse(feature.properties?.organizationIds),
      });
    }
  };

  const Popup = useMemo(() => {
    if (!selectedFeature) return null;

    if (selectedFeature.type === 'slacklineGroup') {
      return <SlacklineGroupInfoPopup id={selectedFeature.id} />;
    }

    if (
      selectedFeature.type === 'countryOrganization' &&
      selectedFeature.cn &&
      selectedFeature.organizationIds
    ) {
      return (
        <CountryOrganizationInfoPopup
          countryName={selectedFeature.cn}
          organizationIds={selectedFeature.organizationIds}
        />
      );
    }
  }, [selectedFeature]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      <CommunityMap
        onSelectedFeatureChange={onSelectedFeatureChange}
        popup={Popup}
      />
    </Box>
  );
}
