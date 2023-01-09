import React from 'react';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { IconButton } from '@mui/material';

interface Props {
  onFocusClick: () => void;
}
export const FocusedButton = (props: Props) => {
  return (
    <IconButton
      onClick={props.onFocusClick}
      sx={{
        position: 'absolute',
        zIndex: 1,
        right: 0,
        width: '32px',
        height: '32px',
        margin: 2,
        color: 'white',
      }}
    >
      <CenterFocusStrongIcon />
    </IconButton>
  );
};
