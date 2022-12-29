import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { lineApi } from 'app/api/line-api';
import { LoadingIndicator } from 'app/components/LoadingIndicator';

import { format } from 'date-fns';
import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { Stack } from '@mui/system';
import { SlacklineDetailInfoField } from 'app/components/TextFields/SlacklineDetailInfoField';
import { SlacklineDetailRestrictionField } from 'app/components/TextFields/SlacklineDetailRestrictionField';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface Props {
  lineId: string;
}

export const LineDetailCard = (props: Props) => {
  const [cardHeaderMenuAnchorEl, setCardHeaderMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const openCardHeaderMenu = Boolean(cardHeaderMenuAnchorEl);

  const { data: lineDetails, isFetching } = lineApi.useGetLineDetailsQuery(
    props.lineId,
  );

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onCardHeaderMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setCardHeaderMenuAnchorEl(event.currentTarget);
  };

  const onCardHeaderMenuClose = () => {
    setCardHeaderMenuAnchorEl(null);
  };

  return (
    <Card sx={{ height: '100%', width: '100%', overflow: 'scroll' }}>
      {isFetching || !lineDetails ? (
        <LoadingIndicator />
      ) : (
        <>
          <CardHeader
            avatar={<Avatar sx={{}}>{lineDetails.type || '?'}</Avatar>}
            action={
              <>
                <IconButton onClick={onCardHeaderMenuClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={cardHeaderMenuAnchorEl}
                  open={openCardHeaderMenu}
                  onClose={onCardHeaderMenuClose}
                >
                  <MenuItem onClick={onCardHeaderMenuClose}>Edit</MenuItem>
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
            image={lineDetails.coverImageUrl}
          />
          <CardContent component={Stack} spacing={2} sx={{}}>
            {lineDetails.restrictionLevel && (
              <SlacklineDetailRestrictionField
                level={lineDetails.restrictionLevel}
                restrictionInfo={lineDetails.restrictionInfo}
              />
            )}
            <SlacklineDetailInfoField
              header="Specs"
              content={`Length: ${lineDetails.length || '?'}m, Height: ${
                lineDetails.height || '?'
              }m`}
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
          </CardContent>
          <CardActions disableSpacing>
            <IconButton>
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron
                and set aside for 10 minutes.
              </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep
                skillet over medium-high heat. Add chicken, shrimp and chorizo,
                and cook, stirring occasionally until lightly browned, 6 to 8
                minutes. Transfer shrimp to a large plate and set aside, leaving
                chicken and chorizo in the pan. Add pimentón, bay leaves,
                garlic, tomatoes, onion, salt and pepper, and cook, stirring
                often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a
                boil.
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes
                and peppers, and cook without stirring, until most of the liquid
                is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add
                reserved shrimp and mussels, tucking them down into the rice,
                and cook again without stirring, until mussels have opened and
                rice is just tender, 5 to 7 minutes more. (Discard any mussels
                that don&apos;t open.)
              </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then
                serve.
              </Typography>
            </CardContent>
          </Collapse>
        </>
      )}
    </Card>
  );
};
