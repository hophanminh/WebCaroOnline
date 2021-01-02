import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import PrivateRoute from "./PrivateRoute.js";
import Menu from "./components/Menu/Menu";
import Home from "./components/Home/Home";
import Account from "./components/User/Account";
import Login from "./components/Authenticate/Login";
import SignUp from "./components/Authenticate/SignUp";
import NotFound from "./components/NotFound";
import ChangePass from "./components/User/ChangePass";

import ActiveAccount from "./components/User/ActiveAccount";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";

import Room from "./components/RoomCurrent/Room"
import RoomFinish from "./components/RoomFinish/RoomFinish"
import FinishRoomList from "./components/User/FinishRoomList.js";


import store from './utils/store.service';
import AuthService from './utils/auth.service'

import socket from "./utils/socket.service";

const routes = [
  {
    path: "/",
    exact: true,
    main: () => <Home />
  },
  {
    path: "/Account",
    private: true,
    main: () => <Account />
  },
  {
    path: "/Password",
    private: true,
    main: () => <ChangePass />
  },
  {
    path: "/Login",
    main: (props) => <Login />
  },
  {
    path: "/Signup",
    main: (props) => <SignUp />
  },
  {
    path: "/Room/:id",
    main: (props) => <Room />
  },
  {

    path: "/activeAccount/:uuid",
    main: (props) => <ActiveAccount />
  },
  {
    path: "/forgotPassword",
    main: (props) => <ForgotPassword />
  },
  {
    path: "/resetPassword/:uuid",
    main: (props) => <ResetPassword />
  },
  {
    path: "/History",
    private: true,
    exact: true,
    main: () => <FinishRoomList />
  },
  {
    path: "/History/Room/:id",
    main: (props) => <RoomFinish />

  },
];
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

export default function App(props) {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser);
  store.subscribe(() => {
    setCurrentUser(store.getState().user);
  });
  useEffect(() => {
    // check if user is already logged in
    store.dispatch({ type: 'user/updateUser' });
    const user = store.getState().user;
    if (user) {
      socket.emit("online", { ID: user.ID, name: user.name });                // announce that you are online
      socket.on("waiting_for_invite_" + user.ID, (invitation) => {                       // announce that you are waiting for invitec
        store.dispatch({ type: 'invitation/add', invitation: invitation });
      });
    }

    // auto sign-out all tabs 
    const handleInvalidToken = e => {
      if (e.key === 'user' && e.oldValue && !e.newValue) {
        AuthService.logout();
        store.dispatch({ type: 'user/updateUser' })
        socket.emit("manually_disconnect");
      }
    }
    window.addEventListener('storage', handleInvalidToken);
    return function cleanup() {
      window.removeEventListener('storage', handleInvalidToken)
    }
  }, []);


  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Menu />
        <Switch>
          {routes.map((route, index) => {
            return (route.private ?
              <PrivateRoute
                isAuthenticated={currentUser}
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.main />}
              />
              :
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.main />}
              />
            )
          })}
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
