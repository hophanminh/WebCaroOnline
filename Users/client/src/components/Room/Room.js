import React from "react";
import { 
  makeStyles,
  Typography, 
  Container, 
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent
} from '@material-ui/core';
import Game from './Game/game';


const useStyles = makeStyles((theme) => ({
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
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Room() {
  const classes = useStyles();
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Room
          </Typography>
        <Grid container spacing={3} >
          <Grid item sm={8} xs={12} >
            <Card className={classes.root}>
              <CardHeader title="Caro Online" />
              <Divider />
              <CardContent>
                <Game />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}