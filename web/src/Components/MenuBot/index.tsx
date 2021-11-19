import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      top: 'auto',
      bottom: 0,
      height: 50,
    },
    color:{
        background: '#0b4e56'
    },
    grow: {
      flexGrow: 1,
    },
    copy: {
      position: 'absolute',
      zIndex: 1,
      top: 15,
      left: '45%',
      right: 0,
      margin: '0 auto',
    },
  }),
);

export default function BottomAppBar() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className= {classes.color}>
          <div className={classes.copy}>
                Copyright © 2021 LinkGus
          </div>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}