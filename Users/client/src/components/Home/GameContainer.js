
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    maxHeight: '500px',
    minWidth: '300px',
  }
}));

const GameContainer = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader title="Caro Online" />
      <Divider />
      <CardContent>
        <Box height={300} position="relative" >
        </Box>
        <Box display="flex" justifyContent="center" mt={2} >

        </Box>
      </CardContent>
    </Card>
  );
};

export default GameContainer;
