import React, { useState } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux'
import {
  useHistory,
  NavLink,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Badge,
  Popover,
  IconButton,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Box,
  Divider,
  Snackbar,
  makeStyles
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';

import Moment from 'react-moment';

import useTitle from "../../utils/title.service";
import AuthService from "../../utils/auth.service";
import store from '../../utils/store.service';
import socket from "../../utils/socket.service";
import config from "../../utils/config.json";

const drawerWidth = config.drawerWidth;

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
  popover: {
    maxHeight: '300px',
  },
  notifyCard: {
    minWidth: '320px',
    maxWidth: '320px',
    fontSize: '14px',
    borderRadius: '0px'
  },
  notifyToolTip: {
    textAlign: 'center',
    marginBottom: '-10px'
  },
  notifyContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkIcon: {
    color: 'green'
  },
  clearIcon: {
    color: 'red'
  }
}));

const data = [{
  ID: 1,
  name: 'admin',
  dateCreate: Date.now(),
},
{
  ID: 2,
  name: 'admin1',
  dateCreate: Date.now(),
},
{
  ID: 3,
  name: 'admin2',
  dateCreate: Date.now(),
},
{
  ID: 4,
  name: 'admin2',
  dateCreate: Date.now(),
},
]

function Topbar(props) {
  const classes = useStyles();
  const history = useHistory();

  // check online
  const [currentUser, setCurrentUser] = useState();
  store.subscribe(() => {
    setCurrentUser(store.getState().user);
  });
  const logOut = (e) => {
    e.preventDefault();
    AuthService.logout();
    props.dispatch({ type: 'user/updateUser' })
    socket.emit("manually_disconnect");
  };

  // popover notification
  const [inviveList, setInviveList] = useState([]);
  store.subscribe(() => {
    setInviveList(store.getState().invitation);
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClickNotify = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseNotify = () => {
    setAnchorEl(null);
  };
  const openNotify = Boolean(anchorEl);
  const id = openNotify ? 'Notify panel' : undefined;

  // accept or refuse invitation
  const handleAccept = (e) => {
    socket.emit("answer_invite", { ID1: e.currentTarget.id, ID2: currentUser.ID, answer: true });
    socket.on("waitng_accept", ({ status, ID }) => {
      if (status && ID) {
        history.push("/Room/" + ID);
      }
      else {
        setOpenSnackbar(true);
      }
      socket.off("waitng_accept");
    });

    store.dispatch({ type: 'invitation/remove', ID: e.currentTarget.id });
  }
  const handleRefuse = (e) => {
    socket.emit("answer_invite", { ID1: e.currentTarget.id, ID2: currentUser.ID, answer: false });
    store.dispatch({ type: 'invitation/remove', ID: e.currentTarget.id });
  }

  // Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);             // snackbar's status
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // sidebar's open
  const openSidebar = props.open;
  return (
    <AppBar position="absolute" className={clsx(classes.appBar, openSidebar && classes.appBarShift)}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message="Timeout. The invitation isn't valid."
      />

      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => props.handleDrawerOpen()}
          className={clsx(classes.menuButton, openSidebar && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          {useTitle()}
        </Typography>

        <div className={classes.topBarButton}>
          {!currentUser && (
            <>
              <ListItem button component={NavLink} to="/Login" className={classes.button}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button component={NavLink} to="/Signup" className={classes.button}>
                <ListItemText primary="Sign-up" />
              </ListItem>
            </>
          )}

          {currentUser && (
            <>
              <IconButton color="inherit" aria-describedby={id} onClick={handleClickNotify}>
                <Badge badgeContent={inviveList ? inviveList.length : 0} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Popover
                className={classes.popover}
                id={id}
                open={openNotify}
                anchorEl={anchorEl}
                onClose={handleCloseNotify}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Card className={classes.notifyCard}>
                  <CardContent className={classes.notifyToolTip}>
                    <Typography variant="body2" color="textSecondary">
                      Max 5 invitations at any time
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Auto delete when leave page
                    </Typography>
                  </CardContent>
                </Card>
                <Divider />

                {inviveList
                  ? inviveList.map((invite, i) => {
                    return (
                      <>
                        <Card className={classes.notifyCard}>
                          <CardContent>
                            <Box className={classes.notifyContent}>
                              <div><b>{invite.name}</b> ask you for a game</div>
                              <div>
                                <IconButton id={invite.ID} size='small' aria-label="accept" onClick={(e) => handleAccept(e)} >
                                  <CheckIcon className={classes.checkIcon} />
                                </IconButton>
                                <IconButton id={invite.ID} size='small' aria-label="refuse" onClick={(e) => handleRefuse(e)}>
                                  <ClearIcon className={classes.clearIcon} />
                                </IconButton>
                              </div>
                            </Box>
                            <Typography variant="body2" color="textSecondary" component="p" >
                              <Moment fromNow>{invite.dateCreate}</Moment>
                            </Typography>
                          </CardContent>
                        </Card>
                        <Divider />
                      </>
                    )
                  })
                  : ""
                }
              </Popover>
              <ListItem button component={NavLink} to="/Login" onClick={(e) => logOut(e)} className={classes.button}>
                <ListItemText primary="Sign-out" />
              </ListItem>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar >
  )
}

export default connect()(Topbar)