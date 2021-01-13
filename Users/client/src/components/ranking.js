import React, {useEffect, useState} from 'react';
import {
    useHistory,
    useLocation
} from "react-router-dom";
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

import DataService from '../utils/data.service';
import TableChartIcon from "@material-ui/icons/TableChart";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { BsFillBarChartFill } from "react-icons/bs";


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

const Rank = () => {
    const classes = useStyles();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await DataService.getUsers();
                console.log(res.data);
                setUsers(res.data);
                setRows(res.data);
            }
            catch (error) {
            }
        }
        fetchData();
    }, []);

    // table
    const [selected, setSelected] = useState();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [rows, setRows] = useState([]);
    // const rows = users;

    const [id, setId] = useState(-1);
    const handleClick = (event, id) => {
        if (selected === id) {
            setSelected(null);
            setId(null);
        }
        else {
            setSelected(id);
            setId(id);
        }
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const emptyRows = rows ? rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage) : 0;

    const history = useHistory();
    const profileUser = () => {
        const path_url = `/user/${id}`
        history.push(path_url);

    }

    const [target, setTarget] = useState("");
    const searchUsernameOrEmail= (e) => {
        const targetField = e.target.value;
        setTarget(targetField);
        console.log(target);
    }

    const searchTarget = async (e) => {
        if(target.length === 0){
            const res = await DataService.getUsers();
            setUsers(res.data);
            setRows(res.data);
        } else {
            const user = await DataService.getUserByUsernameOrEmail(target);
            console.log(user);
            if(user)
                setRows(user.data);
            else setRows(null);
            console.log(rows);
        }
    }

    return (
        <Container component="main" maxWidth={false} className={classes.container}>
            <CssBaseline />
            <Card className={classes.card}>
                <div display="flex">
                    <Grid container >
                        <Grid item justifyContent="flex-start">
                            <Avatar className={classes.avatar}>
                                <BsFillBarChartFill />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Ranking
                            </Typography>
                        </Grid>
                        <Grid item justifyContent="flex-end" alignItems={"center"}>
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <AccountCircle />
                                </Grid>
                                <Grid item>
                                    <TextField id="input-with-icon-grid" label="Username or Email" onChange={(e) => searchUsernameOrEmail(e)}/>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary" onClick={(e) => searchTarget(e)}>
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <Divider />
                <TableContainer className={classes.form}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.bold} align="left">Username</TableCell>
                                <TableCell className={classes.bold} align="left">Email</TableCell>
                                <TableCell className={classes.bold} align="left">Score</TableCell>
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
                                            <TableCell align="left" className={classes.nameCell}>{row.username}</TableCell>
                                            <TableCell align="left" className={classes.nameCell}>{row.email}</TableCell>
                                            <TableCell align="left" className={classes.nameCell}>{row.score}</TableCell>
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
                            <Button size='small' className={classes.button} variant="contained" color="primary" onClick={profileUser}>
                                View
                            </Button>
                        </Box>
                    </TableRow>
                </TableFooter>
            </Card>
        </Container>
    );
};

export default Rank;
