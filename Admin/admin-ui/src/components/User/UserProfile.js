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
import Matches from "./matches";

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
                console.log(ID);
                const res = await DataService.getUserByUserId(ID);
                console.log(res);
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

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangeFullname = (e) => {
        const fullname = e.target.value;
        setFullname(fullname);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const banAccount = (userId) => {
        const ban = DataService.banAccount(userId);

    }

    // auth
    const signup = async (e) => {
        e.preventDefault();
        setMessage("");

        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;


        if (username === "" || email === "" || fullname === "") {
            setMessage("All fields must not be empty");
            setStatus("error");
        }
        else if (username.length > 50 || email.length > 50 || fullname.length > 50) {
            setMessage("All fields must not exceed 50 character");
            setStatus("error");
        }
        else if (!regex.test(email)) {
            setMessage("Email is invalid");
            setStatus("error");
        }
        else {
            try {
                await DataService.changeUserInfo(username, fullname, email)
                setMessage("Thanh đổi thành công");
                setStatus("success");
            }
            catch (error) {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
                setStatus("error");
            }
        }
    };

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3} >
                    <Grid item sm={8} xs={12} >
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
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
                                            autoFocus
                                            onChange={(value) => onChangeUsername(value)}
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
                                            onChange={(value) => onChangeFullname(value)}
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
                                            onChange={(value) => onChangeEmail(value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    onClick={(e) => banAccount(e)}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Ban
                                </Button>
                                <Button
                                    onClick={(e) => signup(e)}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Change account's info
                                </Button>
                            </form>
                        </div>
                    </Grid>
                    <Grid item sm={8} xs={12} >
                        Matches History
                        <Matches userId={ID}/>
                    </Grid>
                </Grid>
            </Container>
        </main>
    );
}