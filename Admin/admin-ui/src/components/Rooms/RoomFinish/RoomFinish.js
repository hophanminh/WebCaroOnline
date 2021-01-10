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
  IconButton,
  Tooltip
} from '@material-ui/core';
import { IconContext } from "react-icons";
import { FaTrophy, FaInfoCircle } from "react-icons/fa";

import Game from './Game/game';
import { Chat } from './ChatOnline'
import socket from "../../../utils/socket.service";
import store from '../../../utils/store.service';
import DataService from "../../../utils/data.service";


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
  topButton: {
    marginLeft: '5px',
    marginRight: '5px',
    borderRight: '1px solid #fff',
    borderRadius: '0px'
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

export default function RoomFinish(props) {
  const classes = useStyles();
  const ID = useParams().id;
  const [room, setRoom] = useState();                   // room's data
  const [gameData, setGameData] = useState();           //game's data
  const [user, setUser] = useState(store.getState());
  const [open, setOpen] = useState(false);             // snackbar's status
  store.subscribe(() => {
    setUser(store.getState());
  });

  // get room data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await DataService.getFinishRoom(ID);
        setRoom(res.data.data[0]);
        setGameData(res.data.gameData);
      }
      catch (error) {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      }
    }
    fetchData();

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
                    <Grid container item xs={4} className={classes.nameContainerLeft} zeroMinWidth>
                      <Typography variant="h5" noWrap className={room.winner === 1 ? classes.winColor : null}>{room.name1 ? "(X) " + room.name1 : "(X) Waiting"}</Typography>
                      {room.name1
                        ? <Box className={classes.trophyCount}>
                          <IconContext.Provider value={{ color: '#e5c100' }}>
                            <FaTrophy className={classes.trophyIcon} />
                          </IconContext.Provider>
                          <Typography noWrap className={null}> - {room.score1}</Typography>
                        </Box>
                        : <></>}
                    </Grid>
                    <Grid container item xs={4} justify="center">
                      <Typography variant="h5">VS</Typography>
                    </Grid>
                    <Grid container item xs={4} className={classes.nameContainerRight} zeroMinWidth>
                      <Typography variant="h5" noWrap className={room.winner === 2 ? classes.winColor : null}>{room.name2 ? "(O) " + room.name2 : "(O) Waiting"}</Typography>
                      {room.name2
                        ? <Box className={classes.trophyCount}>
                          <Typography noWrap className={null}>{room.score2} - </Typography>
                          <IconContext.Provider value={{ color: '#FFD700' }}>
                            <FaTrophy className={classes.trophyIcon} />
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
              ? <Chat userID={user.ID} name={user.name} room={ID} />
              : <Chat userID={null} name={null} room={ID} />}
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}