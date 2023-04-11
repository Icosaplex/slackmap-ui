import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { format } from 'date-fns';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { Stack } from '@mui/system';
import { SlacklineDetailRestrictionField } from 'app/components/TextFields/SlacklineDetailRestrictionField';
import { SlacklineDetailSpecsField } from 'app/components/TextFields/SlacklineDetailSpecsField';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { SlacklineDetailInfoField } from '../../../TextFields/SlacklineDetailInfoField';
import { appColors } from 'styles/theme/colors';
import { imageUrlFromS3Key } from 'utils';
import { guideApi } from 'app/api/guide-api';

interface Props {
  guideId: string;
  onDetailsClick: () => void;
}

export const GuideInfoPopup = (props: Props) => {
  const { data: guideDetails, isFetching: isLoadingLine } =
    guideApi.useGetGuideDetailsQuery(props.guideId);

  const { isDesktop } = useMediaQuery();

  return (
    <Card
      sx={{
        width: isDesktop ? '300px' : '67vw',
      }}
    >
      {isLoadingLine || !guideDetails ? (
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
                  backgroundColor: appColors.guideFeaturesColor,
                }}
              >
                G
              </Avatar>
            }
            title={`Type: ${guideDetails.typeLabel}`}
            subheader={`Last updated: ${format(
              new Date(
                guideDetails.lastModifiedDateTime ??
                  guideDetails.createdDateTime,
              ),
              'dd MMM yyyy',
            )}`}
          />
          <CardMedia
            component="img"
            height="194"
            image={
              imageUrlFromS3Key(
                guideDetails?.images?.find(i => i.isCover)?.s3Key ||
                  guideDetails?.images?.[0]?.s3Key,
              ) || '/images/coverImageFallback.png'
            }
          />
          <CardContent component={Stack} spacing={2} sx={{}}>
            <SlacklineDetailInfoField
              header="Description"
              content={guideDetails.description}
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
