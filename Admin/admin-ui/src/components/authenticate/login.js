import React, { useState, useEffect } from 'react';
import {
    useHistory,
    useLocation
} from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid';
import red from "@material-ui/core/colors/red";
import FacebookIcon from '@material-ui/icons/Facebook';
import MailIcon from '@material-ui/icons/Mail';
import Container from '@material-ui/core/Container';
import AuthService from "../../utils/auth.service";
import socket from "../../utils/socket.service";
import store from '../../utils/store.service';

const queryString = require('query-string');

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
    },
}));

function Login(props) {
    const classes = useStyles();

    useEffect(() => {
        const parsed = queryString.parse(location.search);
        if (parsed.id && parsed.name && parsed.token) {
            AuthService.loginExternal(parsed.id, parsed.name, parsed.token)
            store.dispatch({ type: 'user/updateUser' })
            history.replace("/")

            const user = store.getState().user;
            socket.emit("online", { ID: user.ID, name: user.name });
        }

    }, [])

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    // auth
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };
    const login = async (e) => {
        e.preventDefault();
        setMessage("");

        if (username === "" || password === "") {
            setMessage("Username or password must not be empty");
        }
        else {
            try {
                await AuthService.login(username, password)
                props.dispatch({ type: 'user/updateUser' })

                const user = store.getState();
                socket.emit("online", {ID: user.ID, name: user.name});

                history.replace(from);
            }
            catch (error) {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);

            }
        }
    };

    // auto go to home when logged in
    if (AuthService.getCurrentUser()) {
        history.replace('/');
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Admin Log in
                </Typography>
                <form className={classes.form}>
                    {message && (
                        <div className="form-group">
                            <Alert severity="error">
                                {message}
                            </Alert>
                        </div>
                    )}

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={(value) => onChangeUsername(value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        onChange={(value) => onChangePassword(value)}
                    />
                    <Button
                        onClick={(e) => login(e)}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <div >
                        <Grid container>
                            <Grid item>
                            </Grid>
                            <Grid item>
                                <Button href="http://localhost:9000/auth/facebook">
                                    <FacebookIcon color="primary" style={{ fontSize: 40 }}/>
                                </Button>
                            </Grid>
                            <Button href="http://localhost:9000/auth/google">
                                <MailIcon color="action" style={{ fontSize: 40, color: red[500] }}/>
                            </Button>
                        </Grid>
                    </div>
                </form>
            </div>
        </Container>
    );
}

export default connect()(Login)