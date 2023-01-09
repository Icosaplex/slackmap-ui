import { Alert, AlertTitle } from '@mui/material';
import { selectIsUserSignedIn } from 'app/slices/app/selectors';
import { useConfirm } from 'material-ui-confirm';
import * as React from 'react';
import { useSelector } from 'react-redux';

interface Props {}

export function SignInAlert(props: Props) {
  const isUserSignedIn = useSelector(selectIsUserSignedIn);

  const confirm = useConfirm();
  return (
    <Alert variant="standard" severity={'error'}>
      This is an error alert — check it out! xxx
    </Alert>
  );
}
