import React, { useState, useEffect } from "react";
import {
  useParams,
  Prompt
} from "react-router-dom";
import {
  makeStyles,
  Typography,
  Container,
  Grid,
  Card,
  Divider,
  CardContent,
  Tooltip,
  Box,
  Snackbar,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,

} from '@material-ui/core';
import { IconContext } from "react-icons";
import { FaTrophy, FaHandshake, FaInfoCircle } from "react-icons/fa";
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

import Game from './Game/game';
import Countdown from '../Countdown/Countdown'
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
  leftGrid: {
    minWidth: '434px',
    minHeight: '440px',
  },
  rightGrid: {
    minHeight: '440px',
  },
  winColor: {
    color: "green",
  },
  drawColor: {
    color: "red",
  },
  topButtonContainer: {
    display: "flex",
    justifyContent: 'flex-end ',
  },
  topButton: {
    marginLeft: '5px',
    marginRight: '5px',
    borderRight: '1px solid #fff',
    borderRadius: '0px'
  },
  nameContainerLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  nameContainerRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  countdown: {
    display: "flex",
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  store.subscribe(() => {
    setUser(store.getState().user);
    if (user && room && (room.idUser1 === user.ID || room.idUser2 === user.ID)) {
      setIsPlayer(true)
    }
  });
  const [isPlayer, setIsPlayer] = useState(false);

  // join room
  useEffect(() => {
    if (user) {
      socket.emit('join', { userID: user.ID, name: user.name, room: ID }, (error) => {
        if (error) {
          alert(error);
        }
      });
    }
  }, [ID, user]);

  // get room data
  useEffect(() => {
    socket.emit("get_room_data", { ID }, ({ data, gameData }) => {
      setCounter(data[0].remain);
      setRoom(data[0]);
      setGameData(gameData);
      if (user && (data[0].idUser1 === user.ID || data[0].idUser2 === user.ID)) {
        setIsPlayer(true);
      }
    });

    socket.on('roomData', (data) => {
      setCounter(data[0].remain);
      setRoom(data[0]);
    });

    return () => {
      console.log(user)
      if (user) {
        socket.emit("leave_room", { userID: user.ID, roomID: ID })
      }
      socket.off("roomData");
    }
  }, [ID]);

  // copy ID room to clipboard
  const [open, setOpen] = useState(false);      // show snackbar of copy link
  const copyLink = () => {
    const link = ID;
    // create temporary DOM to hold link, copy to clipboard then remove it
    const dummy = document.createElement('input');
    dummy.value = link;
    document.body.appendChild(dummy);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    setOpen(true);
    socket.emit("timeout", { userID1: room.idUser1, userID2: null, roomID: ID });
  }

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  // countdown
  const [resetCountdown, setResetCountdown] = useState(false);                   // room's data
  const [counter, setCounter] = useState(null);


  // leave room
  const [leave, setLeave] = useState(true);
  useEffect(() => {
    if (leave && isPlayer) {
      window.onbeforeunload = () => ""
    }
    else {
      window.onbeforeunload = undefined
    }
  }, [leave]);

  // ask for draw
  const [askDraw, setAskDraw] = useState(false);
  const handleAskDraw = () => {
    socket.emit("ask_draw", { userID: user.ID, roomID: ID });
  }
  const handleCloseAskDraw = () => {
    setAskDraw(false);
  };
  const handleAcceptAskDraw = () => {
    socket.emit("accept_ask_draw", { userID: user.ID, roomID: ID });
    setAskDraw(false);
  };

  useEffect(() => {           /// wait for ask draw
    if (user && isPlayer) {
      socket.on("waiting_ask_draw", ({ userID }) => {
        if (user.ID !== userID) {
          setAskDraw(true);
        }
      });
      return () => socket.off("waiting_ask_draw");
    }
  }, [user, isPlayer]);

  // resign
  const [resign, setResign] = useState(false);
  const handleOpenResign = () => {
    setResign(true);
  }
  const handleCloseResign = () => {
    setResign(false);
  }
  const handleResign = () => {
    socket.emit("resign", { userID: user.ID, roomID: ID });
    setResign(false);
  }

  return (
    <React.Fragment>

      <Prompt
        when={leave && isPlayer}
        message='You are leaving current room. Are you sure ?'
      />
      <Dialog open={resign} onClose={handleCloseResign} aria-labelledby="form-dialog-title">
        <DialogContent>
          Are you sure you want to resign ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResign} color="primary">
            Cancel
              </Button>
          <Button onClick={handleResign} color="primary">
            Resign
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={askDraw}
        onClose={() => handleCloseAskDraw()}
        message="Your opponent asked for draw. "
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleAcceptAskDraw}>
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseAskDraw}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {user
            ?
            <Grid container spacing={3}>
              <Grid item sm={8} xs={12} className={classes.leftGrid} >
                <Card>
                  <Box className={classes.topButtonContainer}>
                    {isPlayer && room.winner === -1 &&
                      (<Tooltip title="Ask for draw" aria-label="Ask for draw">
                        <IconButton disabled={!(room.ready && room.ready.hasStart)} className={classes.topButton} size="small" onClick={() => handleAskDraw()}>
                          <FaHandshake></FaHandshake>
                        </IconButton>
                      </Tooltip>)
                    }
                    {isPlayer && room.winner === -1 &&
                      (<Tooltip title="Resign" aria-label="Resign">
                        <IconButton disabled={!(room.ready && room.ready.hasStart)} className={classes.topButton} size="small" onClick={() => handleOpenResign()}>
                          <FlagOutlinedIcon></FlagOutlinedIcon>
                        </IconButton>
                      </Tooltip>)
                    }
                    <Tooltip title="Get room's ID" aria-label="Get room's ID">
                      <IconButton className={classes.topButton} size="small" onClick={() => copyLink()}>
                        <FaInfoCircle></FaInfoCircle>
                      </IconButton>
                    </Tooltip>
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
                        <Grid container item lg={4} xs={12} className={classes.nameContainerLeft} zeroMinWidth>
                          <Typography variant="h5" noWrap className={room.winner === 1 ? classes.winColor : null}>{room.name1 ? "(X) " + room.name1 : "(X) Waiting"}</Typography>
                          <Box className={classes.trophyCount}>
                            <IconContext.Provider value={{ color: '#e5c100' }}>
                              <FaTrophy className={classes.trophyIcon} />
                            </IconContext.Provider>
                            <Typography noWrap> - {room.name1 ? room.score1 : 0}</Typography>
                          </Box>
                        </Grid>
                        <Grid container item lg={4} xs={12} className={classes.countdown}>
                          {room.winner === -1 && <Countdown counter={counter} setCounter={setCounter} reset={resetCountdown} setReset={setResetCountdown} />}
                          {room.winner === 0 && <Typography className={classes.drawColor} variant="h5">Draw</Typography>}
                          {(room.winner !== 0 && room.winner !== -1) && <Typography variant="h5">VS</Typography>}
                        </Grid>
                        <Grid container item lg={4} xs={12} className={classes.nameContainerRight} zeroMinWidth>
                          <Typography variant="h5" noWrap className={room.winner === 2 ? classes.winColor : null}>{room.name2 ? "(O) " + room.name2 : "(O) Waiting"}</Typography>
                          <Box className={classes.trophyCount}>
                            <Typography noWrap>{room.name2 ? room.score2 : 0} - </Typography>
                            <IconContext.Provider value={{ color: '#FFD700' }}>
                              <FaTrophy className={classes.trophyIcon} />
                            </IconContext.Provider>
                          </Box>
                        </Grid>

                      </Grid>
                      : <></>
                    }
                    <Divider />
                    <Game roomID={ID} roomData={room} gameData={gameData} reset={resetCountdown} isPlayer={isPlayer} setReset={setResetCountdown} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={4} xs={12} className={classes.rightGrid} >
                {user
                  ? <Chat userID={user.ID} name={user.name} room={ID} status={room ? room.winner : null} />
                  : <Chat name={null} room={ID} />}
              </Grid>
            </Grid>
            :
            <CircularProgress />
          }
        </Container>
      </main>
    </React.Fragment>
  );
}