import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';

import { lineApi } from 'app/api/line-api';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { format } from 'date-fns';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { Stack } from '@mui/system';
import { SlacklineDetailRestrictionField } from 'app/components/TextFields/SlacklineDetailRestrictionField';
import { SlacklineDetailSpecsField } from 'app/components/TextFields/SlacklineDetailSpecsField';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { spotApi } from 'app/api/spot-api';
import { SlacklineDetailInfoField } from '../../TextFields/SlacklineDetailInfoField';
import { appColors } from 'styles/theme/colors';

interface Props {
  id: string;
  type: MapSlacklineFeatureType;
  onDetailsClick: (id: string, type: MapSlacklineFeatureType) => void;
}

interface PopupData {
  name: string;
  avatarImage?: string;
  restrictionLevel?: SlacklineRestrictionLevel;
  restrictionInfo?: string;
  description: string;
  coverImageUrl: string;
  lastUpdate: string;
}

export const InfoPopup = (props: Props) => {
  const { data: lineDetails, isFetching: isLoadingLine } =
    lineApi.useGetLineDetailsQuery(props.id, { skip: props.type === 'spot' });

  const { data: spotDetails, isFetching: isLoadingSpot } =
    spotApi.useGetSpotDetailsQuery(props.id, { skip: props.type === 'line' });

  const { isDesktop } = useMediaQuery();

  const [data, setData] = useState<PopupData>();

  useEffect(() => {
    if (lineDetails && props.type === 'line') {
      setData({
        name: lineDetails.name || 'Unknown Name',
        restrictionLevel: lineDetails.restrictionLevel,
        restrictionInfo: lineDetails.restrictionInfo,
        description: lineDetails.description || 'No description',
        coverImageUrl: lineDetails.coverImageUrl || '',
        lastUpdate: format(
          new Date(
            lineDetails.lastModifiedDateTime ?? lineDetails.createdDateTime,
          ),
          'dd MMM yyyy',
        ),
      });
    }
    if (spotDetails && props.type === 'spot') {
      setData({
        name: spotDetails.name || 'Unknown Name',
        restrictionLevel: spotDetails.restrictionLevel,
        restrictionInfo: spotDetails.restrictionInfo,
        description: spotDetails.description || 'No description',
        coverImageUrl: spotDetails.coverImageUrl || '',
        lastUpdate: format(
          new Date(
            spotDetails.lastModifiedDateTime ?? spotDetails.createdDateTime,
          ),
          'dd MMM yyyy',
        ),
      });
    }
  }, [lineDetails, spotDetails, props.type]);

  return (
    <Card
      sx={{
        width: isDesktop ? '300px' : '67vw',
      }}
    >
      {isLoadingLine || isLoadingSpot || !data ? (
        <CardContent>
          <LoadingIndicator />
        </CardContent>
      ) : (
        <>
          <CardHeader
            avatar={
              <Avatar
                src=""
                sx={{
                  backgroundColor:
                    props.type === 'spot'
                      ? appColors.spotFillColor
                      : appColors.lineStrokeColor,
                }}
              >
                {props.type === 'spot' ? 'S' : 'L'}
              </Avatar>
            }
            title={data.name || 'Unknown Name'}
            subheader={`Last updated: ${data.lastUpdate}`}
          />
          <CardMedia
            component="img"
            height="194"
            image={data.coverImageUrl || '/images/coverImageFallback.png'}
          />
          <CardContent component={Stack} spacing={2} sx={{}}>
            {data.restrictionLevel && (
              <SlacklineDetailRestrictionField
                level={data.restrictionLevel}
                restrictionInfo={data.restrictionInfo}
              />
            )}
            <SlacklineDetailInfoField
              header="Description"
              content={data.description}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                props.onDetailsClick(props.id, props.type);
              }}
            >
              Go To Details
            </Button>
          </CardActions>
        </>
      )}
    </Card>
  );
};
