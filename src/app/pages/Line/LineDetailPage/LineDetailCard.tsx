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
import { lineApi } from 'app/api/line-api';
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
import { OutdatedInfoField } from 'app/components/TextFields/OutdatedInfoField';
import { Position } from '@turf/turf';
import { imageUrlFromS3Key } from 'utils';
import { S3ImageList } from 'app/components/ImageList';
import { useSelector } from 'react-redux';
import { selectIsUserSignedIn } from 'app/slices/app/selectors';

interface Props {
  lineId: string;
  coordinates?: Position;
}

export const LineDetailCard = (props: Props) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSignedIn = useSelector(selectIsUserSignedIn);

  const cardHeaderPopupState = usePopupState({
    variant: 'popover',
    popupId: 'cardHeaderMenu',
  });
  const confirmDialog = useConfirmDialog();

  const { data: lineDetails, isFetching } = lineApi.useGetLineDetailsQuery(
    props.lineId,
  );
  const [deleteLine, { isSuccess: isDeleted }] =
    lineApi.useDeleteLineMutation();

  const [requestEditorship] = lineApi.useRequestTemporaryEditorshipMutation();

  useEffect(() => {
    if (isDeleted) {
      navigate({ pathname: '/', search: searchParams.toString() });
    }
  }, [isDeleted]);

  const onEditClick = async () => {
    cardHeaderPopupState.close();
    navigate(`/line/${props.lineId}/edit`);
  };

  const onDeleteClick = async () => {
    cardHeaderPopupState.close();
    await confirmDialog({
      title: 'Delete line?',
      content: 'Are you sure you want to delete this line?',
    }).then(() => {
      deleteLine(props.lineId);
    });
  };

  const onRequestEditorshipClick = async () => {
    cardHeaderPopupState.close();
    await confirmDialog({
      title: 'Request Temporary Permissions',
      content: `This line seems to have no editors. You can ask for temporary permissions to edit this line. 
        The permissions will be revoked automatically every Sunday night.`,
    }).then(() => {
      requestEditorship(props.lineId);
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
      {isFetching || !lineDetails ? (
        <LoadingIndicator />
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
            action={
              <>
                <IconButton {...bindTrigger(cardHeaderPopupState)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu {...bindMenu(cardHeaderPopupState)}>
                  <MenuItem
                    onClick={onEditClick}
                    disabled={!lineDetails.isUserEditor}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={onDeleteClick}
                    disabled={!lineDetails.isUserEditor}
                  >
                    Delete
                  </MenuItem>
                  {lineDetails.hasNoEditors && (
                    <MenuItem
                      onClick={onRequestEditorshipClick}
                      disabled={!isSignedIn}
                    >
                      Request to Edit
                    </MenuItem>
                  )}
                </Menu>
              </>
            }
            title={lineDetails.name || 'Unknown Name'}
            subheader={`Last updated: ${format(
              new Date(
                lineDetails.lastModifiedDateTime ?? lineDetails.createdDateTime,
              ),
              'dd MMM yyy',
            )}`}
          />
          <CardMedia
            component="img"
            height="194"
            image={
              imageUrlFromS3Key(
                lineDetails?.images?.find(i => i.isCover)?.s3Key,
              ) || '/images/coverImageFallback.png'
            }
          />
          <CardContent component={Stack} spacing={2} sx={{}}>
            <SlacklineDetailRestrictionField
              level={lineDetails.restrictionLevel}
              restrictionInfo={lineDetails.restrictionInfo}
            />
            <OutdatedInfoField
              updatedDate={new Date(
                lineDetails.lastModifiedDateTime ?? lineDetails.createdDateTime,
              )?.toISOString()}
            />
            <SlacklineDetailSpecsField
              header="Specs"
              isAccurate={lineDetails.isMeasured}
              content={[
                {
                  label: 'Slackline Type',
                  value: startCase(lineDetails.type) || '?',
                },
                {
                  label: 'Length',
                  value: `${lineDetails.length || '?'}m`,
                },
                {
                  label: 'Height',
                  value: `${lineDetails.height || '?'}m`,
                },
              ]}
            />
            <SlacklineDetailInfoField
              header="Description"
              content={lineDetails.description || 'Unknown'}
            />
            <SlacklineDetailInfoField
              header="Anchors"
              content={lineDetails.anchorsInfo || 'Unknown'}
            />
            <SlacklineDetailInfoField
              header="Access"
              content={lineDetails.accessInfo || 'Unknown'}
            />
            <SlacklineDetailInfoField
              header="Gear"
              content={lineDetails.gearInfo || 'Unknown'}
            />
            <SlacklineDetailInfoField
              header="Contact"
              content={lineDetails.contactInfo || 'Unknown'}
            />
            <SlacklineDetailInfoField
              header="Additional Details"
              content={lineDetails.extraInfo}
              skipIfEmpty
            />
            {(lineDetails.images?.length || []) > 0 && (
              <>
                <Typography variant="h6">Media</Typography>
                <S3ImageList userMode="view" photos={lineDetails.images} />
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
