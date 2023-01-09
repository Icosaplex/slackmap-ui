import { styled } from '@mui/material';
import React from 'react';
import { Popup, PopupProps } from 'react-map-gl';

export const CustomPopup = styled(Popup)<PopupProps>({
  '.mapboxgl-popup-content': {
    padding: 4,
    background: 'transparent',
    border: 'none',
  },
  '.mapboxgl-popup-close-button': {
    display: 'none',
  },
});
