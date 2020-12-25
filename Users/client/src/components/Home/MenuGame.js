
import React, { useState, useEffect } from 'react';
import {
  useHistory,
} from "react-router-dom";
import {
  Box,
  Card,
  Button,
  IconButton,
  Divider,
  makeStyles,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RefreshIcon from '@material-ui/icons/Refresh';

import DataService from "../../utils/data.service";
import OnlineRoom from './OnlineRoom';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    minHeight: '440px',
    maxHeight: '440px',
    minWidth: '300px',
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
  }
}));

const MenuGame = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [openPlayer, setOpenPlayer] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await DataService.getOnlineRoom();
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

  const handleClickOpenPlayer = () => {
    setOpenPlayer(true);
  };

  const handleClosePlayer = () => {
    setOpenPlayer(false);
  };

  const handleClickOpenViewer = () => {
    setOpenViewer(true);
  };

  const handleCloseViewer = () => {
    setOpenViewer(false);
  };

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

  const joinRoomAsPlayer = async () => {
    try {
      const result = await DataService.joinRoomAsPlayer(roomId);
      history.push("/Room/" + result.data.ID);
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      alert(resMessage)
    }
  }

  const joinRoomAsViewer = async () => {
    try {
      const result = await DataService.joinRoomAsViewer(roomId);
      history.push("/Room/" + result.data.ID);
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      alert(resMessage)
    }
  }

  const handleRefesh = async () => {
    try {
      const res = await DataService.getOnlineRoom();
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

  return (
    <Card className={classes.root}>
      <Box className={classes.menu}>
        <IconButton aria-label="refesh" className={classes.iconButton} onClick={handleRefesh}>
          <RefreshIcon />
        </IconButton>

        <Button className={classes.button} variant="contained" color="primary" onClick={handleClickOpenPlayer}>
          Join
        </Button>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleClickOpenViewer}>
          View
        </Button>
        <Button className={classes.button} variant="contained" color="primary" onClick={createRoom}>
          New room
        </Button>
        <Dialog open={openPlayer} onClose={handleClosePlayer} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Join</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the room's ID
              </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="roomID"
              label="RoomID"
              type="roomID"
              value={roomId}
              fullWidth
              onChange={e => setRoomId(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePlayer} color="primary">
              Cancel
              </Button>
            <Button onClick={joinRoomAsPlayer} color="primary">
              Join as player
              </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openViewer} onClose={handleCloseViewer} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">View</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the room's ID or select from table
              </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="roomID"
              label="RoomID"
              type="roomID"
              value={roomId}
              fullWidth
              onChange={e => setRoomId(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewer} color="primary">
              Cancel
              </Button>
            <Button onClick={joinRoomAsViewer} color="primary">
              Join as viewer
              </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Divider />
      {data
        ? <OnlineRoom data={data} setRoomId={(id) => setRoomId(id)} />
        : <></>
      }

    </Card>
  );
};

export default MenuGame;
