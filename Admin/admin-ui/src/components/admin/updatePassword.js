import React, { useState } from 'react';
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

export default function ChangePass() {
    const classes = useStyles();
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPass2, setNewPass2] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("error");

    const onChangeOldPass = (e) => {
        setOldPass(e.target.value);
    };

    const onChangeNewPass = (e) => {
        setNewPass(e.target.value);
    };

    const onChangeNewPass2 = (e) => {
        setNewPass2(e.target.value);
    };

    // auth
    const changePass = async (e) => {
        e.preventDefault();
        setMessage("");



        if (oldPass === "" || newPass === "" || newPass2 === "") {
            setMessage("All fields must not be empty");
            setStatus("error");
        }
        else if (oldPass.length > 50 || newPass.length > 50 || newPass2.length > 50) {
            setMessage("All fields must not exceed 50 character");
            setStatus("error");
        }
        else if (newPass !== newPass2) {
            setMessage("Passwords don't match");
            setStatus("error");
        }
        else {
            try {
                await DataService.changePassword(oldPass, newPass)
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
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Change password
                </Typography>
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
                                variant="outlined"
                                required
                                fullWidth
                                id="oldPass"
                                label="Old password"
                                name="oldPass"
                                type="password"
                                autoFocus
                                onChange={(value) => onChangeOldPass(value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="newPass"
                                label="New password"
                                name="newPass"
                                type="password"
                                onChange={(value) => onChangeNewPass(value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="newPass2"
                                label="Repeat new password"
                                name="newPass2"
                                type="password"
                                onChange={(value) => onChangeNewPass2(value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        onClick={(e) => changePass(e)}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Change password
                    </Button>
                </form>
            </div>
        </Container>
    );
}