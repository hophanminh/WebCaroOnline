import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ListUser from './ListUser';
import GameContainer from './GameContainer';

import socket from "../../utils/socket.service";

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

export default function Home() {
  const classes = useStyles();

  const [onlineUsers, setOnlineUsers] = useState();   // data board

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
          Play Caro with your friends1
          </Typography>
        <Grid container spacing={3} >
          <Grid item sm={8} xs={12} >
            <GameContainer />
          </Grid>
          <Grid item sm={4} xs={12}>
            <ListUser onlineUsers={onlineUsers}/>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}