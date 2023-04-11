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
  lineId: string;
  onDetailsClick: () => void;
}

export const LineInfoPopup = (props: Props) => {
  const { data: lineDetails, isFetching: isLoadingLine } =
    lineApi.useGetLineDetailsQuery(props.lineId);

  const { isDesktop } = useMediaQuery();

  return (
    <Card
      sx={{
        width: isDesktop ? '300px' : '67vw',
      }}
    >
      {isLoadingLine || !lineDetails ? (
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
                  backgroundColor: appColors.lineStrokeColor,
                }}
              >
                L
              </Avatar>
            }
            title={lineDetails.name || 'Unknown Name'}
            subheader={`Last updated: ${format(
              new Date(
                lineDetails.lastModifiedDateTime ?? lineDetails.createdDateTime,
              ),
              'dd MMM yyyy',
            )}`}
          />
          <CardMedia
            component="img"
            height="194"
            image={
              imageUrlFromS3Key(
                lineDetails?.images?.find(i => i.isCover)?.s3Key ||
                  lineDetails?.images?.[0]?.s3Key,
              ) || '/images/coverImageFallback.png'
            }
          />
          <CardContent component={Stack} spacing={2} sx={{}}>
            {lineDetails.restrictionLevel && (
              <SlacklineDetailRestrictionField
                level={lineDetails.restrictionLevel}
                restrictionInfo={lineDetails.restrictionInfo}
                trimLength={100}
              />
            )}
            <SlacklineDetailInfoField
              header="Description"
              content={lineDetails.description || 'Unknown'}
              trimLength={100}

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
