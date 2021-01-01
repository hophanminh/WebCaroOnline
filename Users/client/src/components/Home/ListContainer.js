
import React, { useState, useEffect } from 'react';
import {
  useHistory,
} from "react-router-dom";
import {
  Box,
  Card,
  Button,
  IconButton,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

import DataService from "../../utils/data.service";
import OnlineRoomList from './OnlineRoomList';
import socket from '../../utils/socket.service';
import store from '../../utils/store.service';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    minHeight: '440px',
    maxHeight: '440px',
    width: '100%',
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: '10px'
  },
  iconButton: {
    marginRight: 'auto',
  },
  button: {
    margin: '5px 10px 5px 10px',
  },
  dialogContent: {
    height: '130px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}));

const ListContainer = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const currentUser = store.getState().user;
  const [data, setData] = useState();

  // get initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await DataService.getOnlineRoomList();
        setData(res.data);
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
  }, [])

  // new room button
  const createRoom = async () => {
    try {
      const res = await DataService.createRoom();
      history.push("/Room/" + res.data.ID);
    }
    catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      alert(resMessage);
    }
  }

  // refesh button
  const handleRefesh = async () => {
    try {
      const res = await DataService.getOnlineRoomList();
      setData(res.data);
    }
    catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      alert(resMessage);
    }
  }

  // dialog for when waiting for quick play
  const [openWaiting, setOpenWaiting] = useState(false);
  const [message, setMessage] = useState('');
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const handleQuickPlay = (e) => {
    socket.emit("quick_play", { ID: currentUser.ID, point: 1000 });
    socket.on("waiting_room_" + currentUser.ID, async ({ status, ID }) => {
      if (status && ID) {
        setMessage("Found an opponent. Joining new room...");
        await delay(3000);
        history.push("/Room/" + ID);
      }
      socket.off("waitng_room_" + currentUser.ID);
    });
    setOpenWaiting(true);
  }

  const handleCloseWaiting = (e) => {
    socket.emit("stop_quick_play", { ID: currentUser.ID });
    socket.off("waiting_room_" + currentUser.ID);
    setOpenWaiting(false);
    setMessage('');
  };

  return (
    <Card className={classes.root}>
      <Box className={classes.menu}>
        <IconButton aria-label="refesh" className={classes.iconButton} onClick={handleRefesh}>
          <RefreshIcon />
        </IconButton>

        <Button className={classes.button} variant="contained" color="primary" onClick={createRoom}>
          New room
        </Button>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleQuickPlay}>
          Quick play
        </Button>
        <Dialog
          open={openWaiting}
          onClose={(e) => handleCloseWaiting(e)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Finding opponent...</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            {message === ''
              ? <CircularProgress />
              : <Typography>{message}</Typography>}
            <DialogContentText id="alert-dialog-description">
              Click outside to close this dialog and stop queueing.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Box>
      <Divider />
      {data
        ? <OnlineRoomList data={data} />
        : <></>
      }

    </Card>
  );
};

export default ListContainer;
