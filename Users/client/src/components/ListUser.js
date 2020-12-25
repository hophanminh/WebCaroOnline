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
    Menu,
    MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

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

}));

const ListUser = (props) => {
    const classes = useStyles();
    const userList = props.onlineUsers;

    // menu action of one user
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
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
                            {true ? <></> :
                                <>
                                    <IconButton edge="end" size="small" onClick={handleClickMenu}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleCloseMenu}
                                    >
                                        <MenuItem>Invite</MenuItem>
                                    </Menu>
                                </>
                            }

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
