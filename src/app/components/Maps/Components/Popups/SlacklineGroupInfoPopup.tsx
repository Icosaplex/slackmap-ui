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
              This information is retrieved from the{' '}
              <a
                href={
                  'https://github.com/International-Slackline-Association/slackline-data/tree/master/communities/groups'
                }
                target="_blank"
                rel="noreferrer"
              >
                public slackline groups data
              </a>
              . If you think it is incorrect, please contact the ISA as
              described in the link.
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
            </CardActions>
          )}
        </>
      )}
    </Card>
  );
};
