import React from 'react';
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
    Popover,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '500px',
        minWidth: '100px',
    },
    list: {
        height: '100%',
        overflow: 'auto'
    },
    nameCard: {
        wordWrap: 'break-word',
    },
    popover: {
        padding: "5px 5px 5px 5px ",
        textTransform: "none",
    }
}));

const ListUser = (props) => {
    const classes = useStyles();
    const userList = props.onlineUsers;
    socket.on("join", setOnlineUsers);
    
    // popover
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClickPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    // invite
    const handleClickInvite = (event) => {

    };

    return (
        <Card className={classes.root}>
            <CardHeader title="Online user" />
            <Divider />
            <List className={classes.list}>
                {userList ?
                    userList.map((user, i) => (
                        <ListItem divider={i < userList.length - 1} key={user.ID} >
                            <ListItemText className={classes.nameCard} primary={user.name} />
                            <IconButton edge="end" size="small" onClick={handleClickPopover}>
                                <MoreVertIcon />
                            </IconButton>
                            <Popover
                                id={i}
                                open={Boolean(anchorEl)}
                                anchorEl={anchorEl}
                                onClose={handleClosePopover}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Button className={classes.popover} size="small" variant="text" onClick={handleClickInvite}>
                                    Invite
                                </Button>
                            </Popover>
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
