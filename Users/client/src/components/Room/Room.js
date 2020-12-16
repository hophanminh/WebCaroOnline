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
  Divider,
  CardContent,
} from '@material-ui/core';
import Game from './Game/game';
import ListUser from '../ListUser';
import { Chat } from '../ChatOnline/'
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
  playerName: {
    maxWidth: "100%",
    wordWrap: 'break-word',
  },
  fixedHeight: {
    height: 240,
  },
  winColor: {
    color: "green",
  }
}));

export default function Room(props) {
  const classes = useStyles();
  const ID = useParams().id;
  const [room, setRoom] = useState();
  const [gameData, setGameData] = useState();
  const [onlineUsers, setOnlineUsers] = useState();   // list of online user
  const [user, setUser] = useState(store.getState());
  store.subscribe(() => {
    setUser(store.getState());
  });

  // join room
  useEffect(() => {
    if (user) {
      socket.emit('join', { name: user.name, room: ID }, (error) => {
        if (error) {
          alert(error);
        }
      });
    }
  }, [ID, user]);

  // get room data
  useEffect(() => {
    socket.emit("get_room_data", ID);
    socket.on('roomData', ({ data, gameData }) => {
      setRoom(data[0]);
      setGameData(gameData);
    });
    return () => {
      socket.off("roomData");
    }
  }, [ID]);

  // get online users
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
        <Grid container spacing={3} >
          <Grid item sm={8} xs={12} >
            <Card>
              <CardContent>
                {room
                  ?
                  <Grid container spacing={3} >
                    <Grid container item xs={4} zeroMinWidth>
                      {room.winner === 1
                        ? <Typography variant="h5" noWrap className={classes.winColor}>{room.name1 ? "(X) " + room.name1 : "(X) Waiting"}</Typography>
                        : <Typography variant="h5" noWrap>{room.name1 ? "(X) " + room.name1 : "(X) Waiting"}</Typography>
                      }

                    </Grid>
                    <Grid container item xs={4} justify="center">
                      <Typography variant="h5">VS</Typography>
                    </Grid>
                    <Grid container item xs={4} justify="flex-end" zeroMinWidth>
                      {room.winner === 2
                        ? <Typography variant="h5" noWrap className={classes.winColor}>{room.name2 ? "(X) " + room.name2 : "(X) Waiting"}</Typography>
                        : <Typography variant="h5" noWrap>{room.name2 ? "(O) " + room.name2 : "(O) Waiting"}</Typography>
                      }
                    </Grid>

                  </Grid>
                  : <></>
                }
                <Divider />
                <Game roomID={ID} roomData={room} gameData={gameData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={4} xs={12}>
            {user
              ? <Chat name={user.name} room={ID} />
              : <Chat name={null} room={ID} />}
            {true ? <></> :
              <ListUser socket={socket} onlineUsers={onlineUsers} />}
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}