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
import { SlacklineDetailInfoField } from '../../../TextFields/SlacklineDetailInfoField';
import { appColors } from 'styles/theme/colors';
import { imageUrlFromS3Key } from 'utils';

interface Props {
  spotId: string;
  onDetailsClick: () => void;
}

export const SpotInfoPopup = (props: Props) => {
  const { data: spotDetails, isFetching: isLoading } =
    spotApi.useGetSpotDetailsQuery(props.spotId);

  const { isDesktop } = useMediaQuery();

  return (
    <Card
      sx={{
        width: isDesktop ? '300px' : '67vw',
      }}
    >
      {isLoading || !spotDetails ? (
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
                  backgroundColor: appColors.spotFillColor,
                }}
              >
                L
              </Avatar>
            }
            title={spotDetails.name || 'Unknown Name'}
            subheader={`Last updated: ${format(
              new Date(
                spotDetails.lastModifiedDateTime ?? spotDetails.createdDateTime,
              ),
              'dd MMM yyyy',
            )}`}
          />
          <CardMedia
            component="img"
            height="194"
            image={
              imageUrlFromS3Key(
                spotDetails?.images?.find(i => i.isCover)?.s3Key,
              ) || '/images/coverImageFallback.png'
            }
          />
          <CardContent component={Stack} spacing={2} sx={{}}>
            {spotDetails.restrictionLevel && (
              <SlacklineDetailRestrictionField
                level={spotDetails.restrictionLevel}
                restrictionInfo={spotDetails.restrictionInfo}
              />
            )}
            <SlacklineDetailInfoField
              header="Description"
              content={spotDetails.description || 'Unknown'}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                props.onDetailsClick();
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
