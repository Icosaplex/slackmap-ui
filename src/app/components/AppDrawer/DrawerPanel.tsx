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
} from '@mui/material';
import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputIcon from '@mui/icons-material/Input';

export const DrawerPanel = () => {
  const userInfo: any = {};

  const dispatch = useDispatch();

  const name: string = userInfo?.name ?? 'Can';
  const surname: string = (userInfo || {})['surname'] || 'Sahin';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 2,
        backgroundColor: t => t.palette.primary.dark,
        color: t => t.palette.primary.contrastText,
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
        <Stack direction={'row'} spacing={2}>
          <Avatar
            sx={{
              width: '48px',
              height: '48px',
              borderStyle: 'solid',
              borderColor: t => t.palette.primary.contrastText,
            }}
            alt="Profile Picture"
            src={userInfo?.profilePictureUrl || ''}
          >
            {name.substring(0, 1)} {surname?.substring(0, 1)}
          </Avatar>

          <Stack spacing={0} justifyContent={'center'} alignItems={'baseline'}>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="h6">{surname}</Typography>
          </Stack>
        </Stack>
        <List>
          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <IconButton
              sx={{
                borderRadius: 1,
                justifyContent: 'flex-start',
                width: '100%',
              }}
              color="inherit"
              to={'/'}
              component={NavLink}
              size="small"
            >
              <AccountCircleIcon />
              <Typography sx={{ marginLeft: 2, fontSize: '0.8rem' }}>
                View Account
              </Typography>
            </IconButton>
          </ListItem>
          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <IconButton
              sx={{
                borderRadius: 1,
                justifyContent: 'flex-start',
                width: '100%',
              }}
              color="inherit"
              to={'/'}
              component={NavLink}
              size="small"
            >
              <InputIcon />
              <Typography sx={{ marginLeft: 2, fontSize: '0.8rem' }}>
                Logout
              </Typography>
            </IconButton>
          </ListItem>
        </List>
      </Stack>
      <Box sx={{ mt: 'auto' }}>{/* <Footer /> */}</Box>
    </Box>
  );
};
