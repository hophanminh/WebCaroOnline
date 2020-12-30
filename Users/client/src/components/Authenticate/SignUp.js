import React, { useState } from 'react';
import {
  useHistory,
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
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import AuthService from "../../utils/auth.service";
import socket from "../../utils/socket.service";
import store from '../../utils/store.service';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignUp(props) {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");

  const [message, setMessage] = useState("");

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

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };
  const onChangePassword2 = (e) => {
    const password2 = e.target.value;
    setPassword2(password2);
  };

  // auth
  const history = useHistory();
  const signup = async (e) => {
    e.preventDefault();
    setMessage("");

    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;


    if (username === "" || password === "" || email === "" || fullname === "" || password2 === "") {
      setMessage("All fields must not be empty");
    }
    else if (username.length > 50 || password.length > 50 || email.length > 50 || fullname.length > 50 || password2.length > 50) {
      setMessage("All fields must not exceed 50 character");
    }
    else if (!regex.test(email)) {
      setMessage("Email is invalid");
    }
    else if (password !== password2) {
      setMessage("Passwords don't match");
    }
    else {
      try {
        await AuthService.register(username, fullname, email, password)
        history.push("/Login");
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
          Sign up
        </Typography>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {message && (
                <div className="form-group">
                  <Alert severity="error">
                    {message}
                  </Alert>
                </div>
              )}
              <TextField
                autoComplete="username"
                variant="outlined"
                required
                fullWidth
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(value) => onChangeEmail(value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(value) => onChangePassword(value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="Repeat password"
                type="password"
                id="password2"
                autoComplete="current-password"
                onChange={(value) => onChangePassword2(value)}
              />
            </Grid>
          </Grid>
          <Button
            onClick={(e) => signup(e)}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default connect()(SignUp);