import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MapIcon from '@mui/icons-material/Map';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { format } from 'date-fns';
import { Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { Stack } from '@mui/system';
import { SlacklineDetailInfoField } from 'app/components/TextFields/SlacklineDetailInfoField';
import { SlacklineDetailRestrictionField } from 'app/components/TextFields/SlacklineDetailRestrictionField';
import { SlacklineDetailSpecsField } from 'app/components/TextFields/SlacklineDetailSpecsField';
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks';
import { useConfirmDialog } from 'utils/hooks/useConfirmDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { appColors } from 'styles/theme/colors';
import startCase from 'lodash.startcase';
import { spotApi } from 'app/api/spot-api';
import { OutdatedInfoField } from 'app/components/TextFields/OutdatedInfoField';
import { Position } from 'geojson';
import { imageUrlFromS3Key } from 'utils';
import { S3ImageList } from 'app/components/ImageList';

interface Props {
  spotId: string;
  coordinates?: Position;
}

export const SpotDetailCard = (props: Props) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const cardHeaderPopupState = usePopupState({
    variant: 'popover',
    popupId: 'cardHeaderMenu',
  });
  const confirmDialog = useConfirmDialog();

  const { data: spotDetails, isFetching } = spotApi.useGetSpotDetailsQuery(
    props.spotId,
  );
  const [deleteSpot, { isSuccess: isDeleted }] =
    spotApi.useDeleteSpotMutation();

  useEffect(() => {
    if (isDeleted) {
      navigate({ pathname: '/', search: searchParams.toString() });
    }
  }, [isDeleted]);

  const onEditClick = async () => {
    cardHeaderPopupState.close();
    navigate(`/spot/${props.spotId}/edit`);
  };

  const onDeleteClick = async () => {
    cardHeaderPopupState.close();
    await confirmDialog({
      title: 'Delete spot?',
      content: 'Are you sure you want to delete this spot?',
    }).then(() => {
      deleteSpot(props.spotId);
    });
  };

  return (
    <Card
      sx={{
        boxShadow: 'none',
        border: 'none',
        height: '100%',
        width: '100%',
        overflow: 'scroll',
      }}
    >
      {isFetching || !spotDetails ? (
        <LoadingIndicator />
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
                S
              </Avatar>
            }
            action={
              <>
                <IconButton {...bindTrigger(cardHeaderPopupState)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu {...bindMenu(cardHeaderPopupState)}>
                  <MenuItem
                    onClick={onEditClick}
                    disabled={!spotDetails.isUserEditor}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={onDeleteClick}
                    disabled={!spotDetails.isUserEditor}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </>
            }
            title={spotDetails.name || 'Unknown Name'}
            subheader={`Last updated: ${format(
              new Date(
                spotDetails.lastModifiedDateTime ?? spotDetails.createdDateTime,
              ),
              'dd MMM yyy',
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
            <SlacklineDetailRestrictionField
              level={spotDetails.restrictionLevel}
              restrictionInfo={spotDetails.restrictionInfo}
            />

            <OutdatedInfoField
              updatedDate={new Date(
                spotDetails.lastModifiedDateTime ?? spotDetails.createdDateTime,
              )?.toISOString()}
            />

            <SlacklineDetailInfoField
              header="Description"
              content={spotDetails.description || 'Unknown'}
            />

            <SlacklineDetailInfoField
              header="Access"
              content={spotDetails.accessInfo || 'Unknown'}
            />

            <SlacklineDetailInfoField
              header="Contact"
              content={spotDetails.contactInfo || 'Unknown'}
            />
            <SlacklineDetailInfoField
              header="Additional Details"
              content={spotDetails.extraInfo}
              skipIfEmpty
            />
            {(spotDetails.images?.length || []) > 0 && (
              <>
                <Typography variant="h6">Media</Typography>
                <S3ImageList userMode="view" photos={spotDetails.images} />
              </>
            )}
          </CardContent>
          <CardActions>
            {props.coordinates && (
              <IconButton
                href={`https://maps.google.com/maps?z=12&t=m&q=loc:${props.coordinates[1]}+${props.coordinates[0]}`}
                target="_blank"
              >
                <MapIcon color="primary" />
              </IconButton>
            )}
          </CardActions>
        </>
      )}
    </Card>
  );
};
