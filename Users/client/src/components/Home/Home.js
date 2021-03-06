import React, { useState, useEffect } from "react";
import {
  useLocation,
  useHistory,
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ListUser from '../ListUser';
import ListContainer from './ListContainer';

import socket from "../../utils/socket.service";
import store from "../../utils/store.service";
import AuthService from "../../utils/auth.service";

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    overflow: 'auto',
    marginTop: '20px',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const Home = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const [onlineUsers, setOnlineUsers] = useState();

  useEffect(() => {
    socket.emit("alert_online_users");
    socket.on("get_online_users", setOnlineUsers);
    return () => {
      socket.off("get_online_users");
    }
  }, [])

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Caro Online
          </Typography>
        <Grid container spacing={3} >
          <Grid item sm={8} xs={12} >
            <ListContainer />
          </Grid>
          <Grid item sm={4} xs={12}>
            <ListUser socket={socket} onlineUsers={onlineUsers} />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}

export default Home;