import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert as MuiAlert, AlertTitle } from '@material-ui/lab';

function Alert(props) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return false;
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={props.open}
      message={props.message}
      onClose={props.handleclose || handleClose}
      autoHideDuration={props.noHide ? null : 4000}
    >
      <MuiAlert
        elevation={6}
        {...props}
        severity={props.severity || 'error'}
        onClose={props.handleclose || handleClose}
      >
        <AlertTitle>{props.message}</AlertTitle>
      </MuiAlert>
    </Snackbar>
  );
}

export default Alert;
