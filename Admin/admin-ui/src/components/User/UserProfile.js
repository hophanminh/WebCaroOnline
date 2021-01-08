import React, { useState, useEffect } from 'react';
import {
    useParams, useHistory,
} from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DataService from "../../utils/data.service";
import FinishRoomList from "../Rooms/FinishRoomList";
import isPlainObject from "react-redux/lib/utils/isPlainObject";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
        width: 200,
        height: 200
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        overflow: 'auto',
        marginTop: '20px',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    fixedHeight: {
        height: 240,
    },
}));

export default function Account() {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("error");

    const ID = useParams().id;
    const history = useHistory();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await DataService.getUserByUserId(ID);
                setUsername(res.data[0].username);
                setEmail(res.data[0].email);
                setFullname(res.data[0].fullname);
            }
            catch (error) {
                history.back();
            }
        }
        fetchData();
    }, [ID])

    const banAccount = (userId) => {
        const ban = DataService.banAccount(userId);

    }


    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3} >
                    <Grid item sm={8} xs={12} >
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar} src={'https://picsum.photos/200'}>
                            </Avatar>
                            <form className={classes.form} noValidate>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        {message && (
                                            <div className="form-group">
                                                <Alert severity={status}>
                                                    {message}
                                                </Alert>
                                            </div>
                                        )}
                                        <TextField
                                            autoComplete="username"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            value={username}
                                            id="username"
                                            label="Username"
                                            name="username"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="fname"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            value={fullname}
                                            id="fullname"
                                            label="Full Name"
                                            name="fullname"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            value={email}
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    onClick={(e) => banAccount(e)}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}
                                >
                                    Ban
                                </Button>
                            </form>
                        </div>
                    </Grid>
                    <Grid item sm={8} xs={12} >
                        <FinishRoomList />
                    </Grid>
                </Grid>
            </Container>
        </main>
    );
}