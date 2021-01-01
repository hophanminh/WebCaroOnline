import React, { useState } from 'react';
import {
  useHistory,
} from "react-router-dom";
import Moment from 'react-moment';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
  TableContainer,
  TableHead,
  TablePagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import DataService from "../../utils/data.service";

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  },

  timeCell: {
    minWidth: '150px',
    maxWidth: '150px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  nameCell: {
    minWidth: '100px',
    maxWidth: '100px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  footer: {
    width: '100%',
    display: 'flex',
  },
  footerRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  buttonBox: {
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    margin: '0px 5px 0px 5px',
  },


}));

const OnlineRoomList = (props) => {
  const classes = useStyles();
  const history = useHistory();

  // table
  const [selected, setSelected] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rows = props.data;

  const handleClick = (event, name) => {
    if (selected === name) {
      setSelected(null);
      setRoomId(null);
    }
    else {
      setSelected(name);
      setRoomId(name);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const emptyRows = rows ? rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage) : 0;

  // button
  const [roomId, setRoomId] = useState("");
  const [openPlayer, setOpenPlayer] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
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
    <React.Fragment>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.bold}>Created</TableCell>
              <TableCell className={classes.bold} align="right">Player 1</TableCell>
              <TableCell className={classes.bold} align="right">Player 2</TableCell>
              <TableCell className={classes.bold} align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isItemSelected = row.ID === selected;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.ID)}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.ID}
                    selected={isItemSelected}>
                    <TableCell component="th" id={index} scope="row" className={classes.timeCell}>
                      <Moment fromNow>{row.dateCreate}</Moment>
                    </TableCell>
                    <TableCell align="right" className={classes.nameCell}>{row.name1}</TableCell>
                    <TableCell align="right" className={classes.nameCell}>{row.name2}</TableCell>
                    {(row.name1 === null || row.name2 === null)
                      ? <TableCell align="right" className={classes.italic}>Waiting</TableCell>
                      : <TableCell align="right">Playing</TableCell>}
                  </TableRow>
                )
              })
              : <></>
            }
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TableFooter className={classes.footer}>
        <TableRow className={classes.footerRow}>
          <TablePagination
            rowsPerPageOptions={[5]}
            count={rows ? rows.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            component='div'
            onChangePage={handleChangePage}
          />
          <Box className={classes.buttonBox}>
            <Button size='small' className={classes.button} variant="contained" color="primary" onClick={handleClickOpenPlayer}>
              Join
        </Button>
            <Button size='small' className={classes.button} variant="contained" color="primary" onClick={handleClickOpenViewer}>
              View
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
        </TableRow>
      </TableFooter>
    </React.Fragment>
  );
}

export default OnlineRoomList;