import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Menu from "./components/menu/menu";
import Home from "./components/home/home";
import Account from "./components/admin/account";
import Login from "./components/authenticate/login";
import SignUp from "./components/authenticate/register";
import NotFound from "./components/NotFound";
import PrivateRoute from "./privateRoute.js";
import ChangePass from "./components/admin/updatePassword";
import Users from "./components/home/managementUsers";
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
    path: "/users",
    main: (props) => <Users />
  }
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
    setCurrentUser(store.getState());
  });


  useEffect(() => {
    // check if user is already logged in
    store.dispatch({ type: 'user/updateUser' });
    const user = store.getState();
    if (user) {
      socket.emit("online", { ID: user.ID, name: user.name });
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
