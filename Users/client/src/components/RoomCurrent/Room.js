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
  Box,
  Snackbar,
  Button
} from '@material-ui/core';
import { IconContext } from "react-icons";
import { FaTrophy } from "react-icons/fa";

import Game from './Game/game';
import { Chat } from './ChatOnline/'
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
    marginTop: '20px',
    marginBottom: '80px',
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
  gridHeight: {
    minHeight: '440px',
    maxHeight: "440px",
  },
  winColor: {
    color: "green",
  },
  shareButtonContainer: {
    display: "flex",
    flexDirection: "row-reverse",
  },
  nameContainerLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'flex-start',
  },
  nameContainerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'flex-end',
  },
  trophyIcon: {
    margin: '0 5px'
  },
  trophyCount: {
    fontSize: '14px',
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems: 'center'
  }
}));

export default function Room(props) {
  const classes = useStyles();
  const ID = useParams().id;
  const [room, setRoom] = useState();                   // room's data
  const [gameData, setGameData] = useState();           //game's data
  const [user, setUser] = useState(store.getState().user);
  const [open, setOpen] = useState(false);             // snackbar's status
  store.subscribe(() => {
    setUser(store.getState().user);
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
    socket.emit("get_room_data", {ID}, ({ data, gameData }) => {
      setRoom(data[0]);
      setGameData(gameData);
    });

    socket.on('roomData', (data) => {
      setRoom(data[0]);
    });

    return () => {
      socket.emit("leave_room", ID)
      socket.off("roomData");
    }
  }, [ID]);

  // copy ID room to clipboard
  const copyLink = () => {

    const link = ID;
    // create temporary DOM to hold link, copy to clipboard then remove it
    const dummy = document.createElement('input');
    dummy.value = link;
    document.body.appendChild(dummy);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    // show alert
    setOpen(true);
  }

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item sm={8} xs={12} className={classes.gridHeight} >
            <Card>
              <Box className={classes.shareButtonContainer}>
                <Button size="small" variant="contained" color="primary" onClick={() => copyLink()}>
                  Get room's ID
                </Button>
                <Snackbar
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  open={open}
                  onClose={handleCloseSnackbar}
                  message="ID copied to clipboard"
                />
              </Box>
              <CardContent>
                {room
                  ?
                  <Grid container spacing={3} >
                    <Grid container item xs={4} className={classes.nameContainerLeft} zeroMinWidth>
                      <Typography variant="h5" noWrap className={room.winner === 1 ? classes.winColor : null}>{room.name1 ? "(X) " + room.name1 : "(X) Waiting"}</Typography>
                      {room.name1
                        ? <Box className={classes.trophyCount}>
                          <IconContext.Provider value={{ color: '#e5c100' }}>
                            <FaTrophy className={classes.trophyIcon}/>
                          </IconContext.Provider>
                          <Typography noWrap className={null}> - {room.score1}</Typography>
                        </Box>
                        : <></>}
                    </Grid>
                    <Grid container item xs={4} justify="center">
                      <Typography variant="h5">VS</Typography>
                    </Grid>
                    <Grid container item xs={4} className={classes.nameContainerRight} zeroMinWidth>
                      <Typography variant="h5" noWrap className={room.winner === 2 ? classes.winColor : null}>{room.name2 ? "(X) " + room.name2 : "(X) Waiting"}</Typography>
                      {room.name2
                        ? <Box className={classes.trophyCount}>
                          <Typography noWrap className={null}>{room.score2} - </Typography>
                          <IconContext.Provider value={{ color: '#FFD700' }}>
                            <FaTrophy className={classes.trophyIcon}/>
                          </IconContext.Provider>
                        </Box>
                        : <></>}
                    </Grid>

                  </Grid>
                  : <></>
                }
                <Divider />
                <Game roomID={ID} roomData={room} gameData={gameData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={4} xs={12} className={classes.gridHeight} >
            {user
              ? <Chat userID={user.ID} name={user.name} room={ID} status={room ? room.winner : null} />
              : <Chat name={null} room={ID} />}
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}