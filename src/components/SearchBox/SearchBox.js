import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    '& input': {
      padding: '0 10px 0 5px',
      fontSize: '16px',
    },
  },
  iconButton: {
    padding: '5px 0px 5px 10px',
    '& .MuiSvgIcon-root': {
      fontSize: '22px',
      opacity: '.5',
    },
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function SearchBox() {
  const classes = useStyles();

  return (
    <Paper component="form" variant="outlined" className={classes.root}>
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="search..."
        inputProps={{ 'aria-label': 'search' }}
      />
    </Paper>
  );
}
