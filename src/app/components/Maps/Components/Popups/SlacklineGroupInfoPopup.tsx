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
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { Stack } from '@mui/system';
import { SlacklineDetailRestrictionField } from 'app/components/TextFields/SlacklineDetailRestrictionField';
import { SlacklineDetailSpecsField } from 'app/components/TextFields/SlacklineDetailSpecsField';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import { spotApi } from 'app/api/spot-api';
import { SlacklineDetailInfoField } from '../../../TextFields/SlacklineDetailInfoField';
import { appColors } from 'styles/theme/colors';

const groupEditGoogleFormUrl =
  ' https://docs.google.com/forms/d/e/1FAIpQLSdEPV1ZV8TjmkQUGmKP8L0LrrkyUlspnfGFZ3dw32ocJ_zXVQ/viewform?usp=pp_url&entry.677223950=Edit+existing+data&entry.1762852981=';

interface GroupInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
  link?: string;
  email?: string;
  members?: number;
  isRegional?: boolean;
  createdDateTime: string;
  updatedDateTime: string;
}
interface Props {
  id: string;
}

let groupsJson: GroupInfo[] = [];

const getGroupInfo = async (id: string) => {
  if (groupsJson.length === 0) {
    const response = await fetch(
      'https://raw.githubusercontent.com/International-Slackline-Association/slackline-data/master/communities/groups/groups.json',
    ).then(r => r.json());
    groupsJson = response;
  }
  return groupsJson.find(c => c.id === id);
};

export const SlacklineGroupInfoPopup = (props: Props) => {
  const { isDesktop } = useMediaQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState<GroupInfo>();

  useEffect(() => {
    setIsLoading(true);
    getGroupInfo(props.id).then(r => {
      if (r) {
        setGroup(r);
      }
      setIsLoading(false);
    });
  }, [props.id]);

  let title = group?.name || 'Unknown Name';
  title = title + (group?.isRegional ? ' (Regional)' : '');

  return (
    <Card
      sx={{
        width: isDesktop ? '300px' : '67vw',
      }}
    >
      {isLoading || !group ? (
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
                  backgroundColor: appColors.isaBlue,
                }}
              >
                G
              </Avatar>
            }
            title={title}
            subheader={`Last updated: ${format(
              new Date(group.updatedDateTime ?? group.createdDateTime),
              'dd MMM yyyy',
            )}`}
          />
          <CardContent component={Stack} spacing={2} sx={{}}>
            <Box>
              <Typography variant="body2" color={t => t.palette.text.secondary}>
                Member Count: <b>{group.members || 'Unknown'}</b>
              </Typography>
              <Typography variant="body2" color={t => t.palette.text.secondary}>
                Email: <b>{group.email || 'Unknown'}</b>
              </Typography>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: t => t.palette.text.secondary,
                fontSize: '0.7rem',
                fontStyle: 'italic',
              }}
            >
              All the data is public on{' '}
              <a
                href={
                  'https://github.com/International-Slackline-Association/slackline-data/tree/master/communities/groups'
                }
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              . If you know how to use Github edit the data directly on there,
              otherwise fill in the form by clicking on the "Modify" button.
            </Typography>
          </CardContent>
          {group.link && (
            <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
              <Button
                variant="contained"
                href={group.link}
                target="_blank"
                rel="noreferrer"
              >
                Visit Page
              </Button>
              <Button
                variant="contained"
                color="error"
                href={groupEditGoogleFormUrl + encodeURIComponent(group.name)}
                target="_blank"
                rel="noreferrer"
              >
                Modify
              </Button>
            </CardActions>
          )}
        </>
      )}
    </Card>
  );
};
