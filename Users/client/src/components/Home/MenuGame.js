
import React from 'react';
import {
  useHistory,
} from "react-router-dom";
import {
  Box,
  Card,
  Button,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
} from '@material-ui/core';
import DataService from "../../utils/data.service";

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    maxHeight: '500px',
    minWidth: '300px',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

const MenuGame = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();

  const createRoom = async () => {
    try {
      const res = await DataService.createRoom();
      history.push("/Room/" + res.data.ID);
    }
    catch (error) {
      alert(error);
    }

  }

  return (
    <Card className={classes.root}>
      <CardHeader title="Caro Online" />
      <Divider />
      <CardContent>
        <Box className={classes.menu} height={300} position="relative" >
          <Button variant="contained" color="primary" onClick={createRoom}>
            Create new room
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MenuGame;
