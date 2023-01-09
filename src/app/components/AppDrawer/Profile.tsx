import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch } from 'react-redux';
import InputIcon from '@mui/icons-material/Input';
import { useSelector } from 'react-redux';
import { selectIsUserSignedIn } from 'app/slices/app/selectors';
import { appActions } from 'app/slices/app';
import { AuthState } from 'app/slices/app/types';
import { Auth } from 'aws-amplify';
import LoginIcon from '@mui/icons-material/Login';
import { accountApi } from 'app/api/account-api';
import { LoadingIndicator } from '../LoadingIndicator';

export const Profile = () => {
  const isSignedIn = useSelector(selectIsUserSignedIn);

  const { data: userInfo, isFetching } = accountApi.useGetBasicDetailsQuery(
    undefined,
    {
      skip: !isSignedIn,
    },
  );

  const dispatch = useDispatch();

  const name: string = userInfo?.name ?? '';
  const surname: string = userInfo?.['surname'] || '';

  const signInClicked = () => {
    dispatch(appActions.updateAuthState(AuthState.SigningIn));
    Auth.federatedSignIn();
  };

  const signOutClicked = () => {
    dispatch(appActions.updateAuthState(AuthState.SigningOut));
  };

  return !isSignedIn ? (
    <Box>
      <Button
        variant="contained"
        startIcon={<AccountCircleIcon />}
        onClick={signInClicked}
      >
        Sign In / Sign Up
      </Button>
    </Box>
  ) : (
    <Stack direction={'row'} spacing={2}>
      {isFetching ? (
        <LoadingIndicator />
      ) : (
        <>
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
          <Grid spacing={0} container sx={{}}>
            <Grid item xs={12}>
              <Typography variant="body1">
                {name} {surname}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title={'Go to ISA Profile'}>
                <IconButton
                  color="inherit"
                  href={'https://account.slacklineinternational.org'}
                  target="_blank"
                  rel="noopener"
                  component={Link}
                  size="small"
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={'Logout'}>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={signOutClicked}
                >
                  <InputIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </>
      )}
    </Stack>
  );
};
