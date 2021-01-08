import React, { useState, useEffect } from 'react';
import {
  useHistory,
  useParams,
} from "react-router-dom";
import Moment from 'react-moment';
import {
  Container,
  CssBaseline,
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
  Card,
  Divider,
  Typography,
  Avatar,
  makeStyles,
} from '@material-ui/core';
import TableChartIcon from '@material-ui/icons/TableChart';
import DataService from "../../utils/data.service";
import store from '../../utils/store.service';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  table: {
    borderTop: '1px solid #999'
  },
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

const FinishRoomList = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const {id} = useParams();
  const [data, setData] = useState();
  const [user, setUser] = useState([]);
  const [nMatch, setNMatch] = useState(0);
  const [rate, setRate] = useState(0);

  // get initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await DataService.getUserByUserId(id);
        setUser(res.data[0]);
        console.log("User name: " + user.username );
        if (user) {
          const res = await DataService.getFinishRoomList(user.ID);
          setData(res.data);
          setNMatch(res.data.length);
        }
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
  }, [user]);

  // table
  const [selected, setSelected] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rows = data;

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
  const handleClickViewer = () => {
    history.push("/History/Room/" + roomId);
  }

  return (
    <Container component="main" maxWidth={false} className={classes.container}>
      <CssBaseline />
      <Card className={classes.card}>
        <Avatar className={classes.avatar}>
          <TableChartIcon />
        </Avatar>
        <div display="flex" flexDirection="row" justifyContent="space-between">
          <Typography component="h1" variant="h5" flex="1">
            Game History
          </Typography>
          <Typography component="h1" variant="h5" flex="1">
            Total Match: {nMatch}
          </Typography>
        </div>
        <Divider />
        <TableContainer className={classes.form}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.bold}>Created</TableCell>
                <TableCell className={classes.bold} align="right">Host match</TableCell>
                <TableCell className={classes.bold} align="right">Player 2</TableCell>
                <TableCell className={classes.bold} align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  const isItemSelected = row.ID === selected;

                  const isPlayer1 = row.name1 === user.username ? 1 : 2;
                  let isWin = null;
                  if (row.winner === 0) {
                    isWin = "Draw"
                  }
                  else if (isPlayer1 === row.winner) {
                    isWin = "Won";
                  }
                  else if (isPlayer1 !== row.winner) {
                    isWin = "Lost"
                  }

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
                      <TableCell align="right" className={classes.bold}>{isWin}</TableCell>
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
              <Button size='small' className={classes.button} variant="contained" color="primary" onClick={handleClickViewer}>
                View
            </Button>
            </Box>
          </TableRow>
        </TableFooter>
      </Card>
    </Container>
  );
}

export default FinishRoomList;