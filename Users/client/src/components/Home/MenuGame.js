
import React, { useState } from 'react';
import {
  useHistory,
} from "react-router-dom";
import {
  Box,
  Card,
  Button,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DataService from "../../utils/data.service";

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    maxHeight: '500px',
    minWidth: '300px',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    marginBottom: "10px",
    width: "200px",
  }
}));

const MenuGame = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();
  const [openPlayer, setOpenPlayer] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);

  const [roomId, setRoomId] = useState("");

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

  return (
    <Card className={classes.root}>
      <CardHeader title="Caro Online" />
      <Divider />
      <CardContent>
        <Box className={classes.menu} height={300} position="relative" >
          <Button className={classes.button} variant="contained" color="primary" onClick={createRoom}>
            Create new room
          </Button>
          <Button className={classes.button} variant="contained" color="primary" onClick={handleClickOpenPlayer}>
            Join room as Player
          </Button>
          <Dialog open={openPlayer} onClose={handleClosePlayer} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the RoomID
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="roomID"
                label="RoomID"
                type="roomID"
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
          <Button className={classes.button} variant="contained" color="primary" onClick={handleClickOpenViewer}>
            Join room as Viewer
          </Button>
          <Dialog open={openViewer} onClose={handleCloseViewer} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the RoomID
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="roomID"
                label="RoomID"
                type="roomID"
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
      </CardContent>
    </Card>
  );
};

export default MenuGame;
