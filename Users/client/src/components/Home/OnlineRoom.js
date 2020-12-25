import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Moment from 'react-moment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
  }

}));

const OnlineRoom = (props) => {
  const classes = useStyles();
  const [selected, setSelected] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rows = props.data;

  const handleClick = (event, name) => {
    if (selected === name) {
      setSelected(null);
      props.setRoomId(null);
    }
    else {
      setSelected(name);
      props.setRoomId(name);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows = rows ? rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage) : 0;

  return (
    <Box className={classes.root}>
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
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={rows ? rows.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
      />
    </Box>
  );
}

export default OnlineRoom;