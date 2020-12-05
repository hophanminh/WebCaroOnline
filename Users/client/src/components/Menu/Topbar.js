import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux'
import {
  NavLink,
} from "react-router-dom";
import useTitle from "../../utils/title.service";
import AuthService from "../../utils/auth.service";
import store from '../../utils/store.service';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    invisible: {
      cd: "hidden"
    },  
    topBarButton: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    button: {
      width: 'auto',
    },
}));

function Topbar(props) {
    const classes = useStyles();
    const [currentUser, setCurrentUser] = useState();

    store.subscribe(() => {
      setCurrentUser(store.getState());
    });


    const logOut = (e) => {
      e.preventDefault();
      AuthService.logout();
      props.dispatch({ type: 'user/updateUser' })
    };
  
    const open = props.open;
    return (
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() =>props.handleDrawerOpen()}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {useTitle()}
          </Typography>

          <div className={classes.topBarButton}>
            {!currentUser && (
              <ListItem button component={NavLink} to="/Login" className={classes.button}>
              <ListItemText primary="Login" />
              </ListItem>
            )}

            {!currentUser && (
              <ListItem button component={NavLink} to="/Signup" className={classes.button}>
              <ListItemText primary="Sign-up" />
              </ListItem>
            )}

            {currentUser && (
              <ListItem button component={NavLink} to="/Login" onClick={(e) => logOut(e)} className={classes.button}>
              <ListItemText primary="Sign-out" />
              </ListItem>
            )}
          </div>
        </Toolbar>
      </AppBar>
    )
}

export default connect()(Topbar)