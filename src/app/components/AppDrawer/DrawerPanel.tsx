import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Stack,
  Box,
  IconButton,
  Link,
  Avatar,
  Button,
  Grid,
  Tooltip,
  styled,
  IconButtonProps,
} from '@mui/material';
import React, { ReactNode } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputIcon from '@mui/icons-material/Input';
import PublicIcon from '@mui/icons-material/Public';
import { Profile } from './Profile';
import PeopleIcon from '@mui/icons-material/People';
import { Footer } from './Footer';

export const DrawerPanel = () => {
  const location = useLocation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 2,
      }}
    >
      <Stack spacing={2} alignItems={'strech'}>
        <Link component={RouterLink} to="/">
          <img
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            src={'/images/slackmapLogoWithText.png'}
            alt="Slackmap Logo"
          />
        </Link>
        <Divider sx={{ borderColor: 'inherit', opacity: 0.3 }} />
        <Profile />
        <List>
          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <NavigationIcon to="/" selected={location.pathname === '/'}>
              <PublicIcon />
              <Typography>World Map</Typography>
            </NavigationIcon>
          </ListItem>
          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <NavigationIcon
              to="/communities"
              selected={location.pathname === '/communities'}
            >
              <PeopleIcon />
              <Typography>Communities</Typography>
            </NavigationIcon>
          </ListItem>
        </List>
      </Stack>
      <Box sx={{ mt: 'auto' }}>
        <Footer />
      </Box>
    </Box>
  );
};

const NavigationIcon = (props: {
  to: string;
  children: ReactNode;
  disabled?: boolean;
  selected?: boolean;
}) => {
  return (
    <IconButton
      color="inherit"
      to={props.to}
      component={NavLink}
      size="small"
      disabled={props.disabled}
      sx={{
        borderRadius: 1,
        justifyContent: 'flex-start',
        width: '100%',
        color: 'inherit',
        '& .MuiTypography-body1': {
          marginLeft: 2,
        },
        backgroundColor: t =>
          props.selected ? t.palette.primary.main : 'none',
      }}
    >
      {props.children}
    </IconButton>
  );
};
