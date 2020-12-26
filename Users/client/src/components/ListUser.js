import React, { useState } from 'react';
import {
    useHistory,
} from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Menu,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    CircularProgress,
    MenuItem,
    Typography
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import socket from '../utils/socket.service';
import store from '../utils/store.service';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '500px',
        minWidth: '100px',
    },
    cardHeader: {
        height: '64px'
    },
    list: {
        overflow: 'auto'
    },
    nameCard: {
        wordWrap: 'break-word',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    inviteButton: {
        height: '15px'
    },
    dialogContent: {
        height: '130px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
}));

const ListUser = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const currentUser = store.getState().user;
    const userList = props.onlineUsers;

    // menu action of one user
    const [message, setMessage] = useState('');
    const [selected, setSelected] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClickMenu = (e) => {
        setSelected(e.currentTarget.id);
        setAnchorEl(e.currentTarget);
    };
    const handleCloseMenu = (e) => {
        setAnchorEl(null);
    };

    const handleInvite = (e) => {
        socket.emit("invite", { ID1: currentUser.ID, name1: currentUser.name, ID2: selected });
        socket.on("waitng_accept", ({ status, ID }) => {
            if (status && ID) {
                history.push("/Room/" + ID);
            }
            else {
                setMessage("User has refused your invitation. Please try again");
            }
            socket.off("waitng_accept");
        });
        setOpenWaiting(true);
    }
    // dialog for when waiting for invitation
    const [openWaiting, setOpenWaiting] = useState(false);
    const handleCloseWaiting = (e) => {
        socket.emit("stop_invite", { ID1: currentUser.ID, ID2: selected });
        socket.off("waitng_accept");
        setSelected(null);
        setOpenWaiting(false);
        setAnchorEl(null);
        setMessage('');
    };


    return (
        <Card className={classes.root}>
            <CardHeader
                className={classes.cardHeader}
                title="Online user"
            />
            <Divider />

            <List className={classes.list}>
                {userList ?
                    userList.map((user, i) => (
                        <ListItem divider={i < userList.length - 1} key={user.ID} >
                            <ListItemText className={classes.nameCard} primary={user.name} />
                            <IconButton id={user.ID} edge="end" size="small" onClick={(e) => handleClickMenu(e)}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={(e) => handleCloseMenu(e)}
                            >
                                <MenuItem className={classes.inviteButton} >
                                    <Button size='small' onClick={(e) => handleInvite(e)}>Invite</Button>
                                    <Dialog
                                        open={openWaiting}
                                        onClose={(e) => handleCloseWaiting(e)}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">{"Waiting..."}</DialogTitle>
                                        <DialogContent className={classes.dialogContent}>
                                            {message === ''
                                                ? <CircularProgress />
                                                : <Typography>{message}</Typography>}
                                            <DialogContentText id="alert-dialog-description">
                                                Closing this dialog will cancel the invitation.
                                            </DialogContentText>
                                        </DialogContent>
                                    </Dialog>
                                </MenuItem>
                            </Menu>

                        </ListItem>
                    )) : ""
                }
            </List>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={1} >
                <Button color="primary" endIcon={<ArrowRightIcon />} size="small" variant="text" >
                    View all
                </Button>
            </Box>

        </Card>
    );
};

export default ListUser;
