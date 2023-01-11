import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MapIcon from '@mui/icons-material/Map';
import { lineApi } from 'app/api/line-api';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { format } from 'date-fns';
import {
  Alert,
  Box,
  Button,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Stack } from '@mui/system';
import { SlacklineDetailInfoField } from 'app/components/TextFields/SlacklineDetailInfoField';
import { SlacklineDetailRestrictionField } from 'app/components/TextFields/SlacklineDetailRestrictionField';
import { SlacklineDetailSpecsField } from 'app/components/TextFields/SlacklineDetailSpecsField';
import { bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import PublicIcon from '@mui/icons-material/Public';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';

export type DrawingMode = 'line' | 'extras';

interface Props {
  lineId?: string;
  mode: 'edit' | 'create';
  mapErrors?: string[];
}

export const GuideEditCard = (props: Props) => {
  const { data: lineDetails, isFetching } = lineApi.useGetLineDetailsQuery(
    props?.lineId || '',
    { skip: !props?.lineId },
  );

  const isCreateMode = props.mode === 'create';

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
      {isFetching || (!isCreateMode && !lineDetails) ? (
        <LoadingIndicator />
      ) : (
        <>
          <CardHeader
            avatar={
              <Avatar sx={{ backgroundColor: t => t.palette.primary.main }}>
                <AddIcon />
              </Avatar>
            }
            title={
              <Typography variant="h5">
                {isCreateMode
                  ? 'Create New Line'
                  : lineDetails?.name || 'Unknown Name?'}
              </Typography>
            }
            subheader={
              !isCreateMode &&
              `Last updated: ${format(
                new Date(
                  lineDetails?.lastModifiedDateTime ??
                    lineDetails!.createdDateTime,
                ),
                'dd MMM yyy',
              )}`
            }
          />
          <CardContent component={Stack} spacing={1} sx={{}}>
            <Stack spacing={1}>
              {props.mapErrors?.map(e => (
                <Alert key={e} severity="error">
                  {e}
                </Alert>
              ))}
            </Stack>
            <Stack spacing={1}>
              <Typography
                variant="h6"
                component={'div'}
                sx={{ color: t => t.palette.primary.main }}
              >
                <DescriptionIcon sx={{ mr: 1 }} />
                Guide Details
              </Typography>
            </Stack>
            <CardActions>
              <Button
                variant="contained"
                // startIcon={<AccountCircleIcon />}
                // onClick={}
              >
                Submit
              </Button>
              <IconButton>
                <MapIcon color="primary" />
              </IconButton>
              <IconButton>
                <ShareIcon color="primary" />
              </IconButton>
            </CardActions>
          </CardContent>
        </>
      )}
    </Card>
  );
};
