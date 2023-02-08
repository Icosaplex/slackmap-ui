import React from 'react';

import { Grid, IconButton, Link, Typography } from '@mui/material';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useDispatch } from 'react-redux';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

export const Footer = () => {
  const dispatch = useDispatch();
  const { isDesktop } = useMediaQuery();

  return (
    <Grid container spacing={1} sx={{}}>
      <Grid item xs={12}>
        <Link
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
          href="https://www.slacklineinternational.org"
          target="_blank"
        >
          <img alt="ISA Logo" src="/images/logo-contrast.svg" width="100%" />
        </Link>
      </Grid>
      <Grid item xs={6}>
        <IconButton
          sx={{ borderRadius: 0, padding: 0 }}
          size="small"
          color="inherit"
          target="_blank"
          href={`https://github.com/International-Slackline-Association`}
        >
          <GitHubIcon sx={{ fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
            Open Source
          </Typography>
        </IconButton>
      </Grid>
      <Grid item xs={6}>
        <IconButton
          sx={{ borderRadius: 0, padding: 0 }}
          size="small"
          color="inherit"
          href={`mailto:${'slackmap@slacklineinternational.org'}?subject=${
            encodeURIComponent('Slackmap Contact') || ''
          }&body=${encodeURIComponent('') || ''}`}
        >
          <EmailIcon sx={{ fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
            Contact
          </Typography>
        </IconButton>
      </Grid>
      <Grid item xs={6}>
        <IconButton
          sx={{ borderRadius: 0, padding: 0 }}
          color="inherit"
          href="https://data.slacklineinternational.org/access/slackmap.com-faq/"
        >
          <HelpCenterIcon sx={{ fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
            FAQ
          </Typography>
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <Typography fontSize={'0.5rem'}>
          Copyright © 2022 International Slackline Association. All rights
          reserved.
        </Typography>
      </Grid>
    </Grid>
  );
};
