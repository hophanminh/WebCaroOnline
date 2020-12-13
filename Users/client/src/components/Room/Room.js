import React, { useState, useEffect } from "react";
import {
  useParams,
} from "react-router-dom";
import {
  makeStyles,
  Typography,
  Container,
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent
} from '@material-ui/core';
import Game from './Game/game';
import ListUser from '../ListUser';
import socket from "../../utils/socket.service";
import store from '../../utils/store.service';


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

export default function Room() {
  const classes = useStyles();
  const ID = useParams().id;

  const [onlineUsers, setOnlineUsers] = useState();   // data board
  const [room, setRoom] = useState();

  useEffect(() => {
    socket.emit("alert_online_users");
    socket.on("get_online_users", setOnlineUsers);

    // join room
    const user = store.getState();
    const userID = user ? user.ID : null;
    const userName = user ? user.name : null;

    socket.emit("join", { userID: userID, userName: userName, roomID: ID });

  const getAddress = "get_room";
  socket.on(getAddress, setRoom);

  return () => {
    socket.off("get_online_users");
    socket.off(getAddress);
  }
}, [ID])

console.log(room);
return (
  <main className={classes.content}>
    <div className={classes.appBarSpacer} />
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h3" component="h2" gutterBottom align="center">
        Room
          </Typography>
      <Grid container spacing={3} >
        <Grid item sm={8} xs={12} >
          <Card>
            <CardHeader title="Caro Online" />
            <Divider />
            <CardContent>
              <Game />
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={4} xs={12}>
          <ListUser socket={socket} onlineUsers={onlineUsers} />
        </Grid>
      </Grid>
    </Container>
  </main>
);
}