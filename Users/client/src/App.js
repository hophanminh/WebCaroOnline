import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Provider } from 'react-redux'

import Menu from "./components/Menu/Menu";
import Home from "./components/Home/Home";
import Account from "./components//User/Account";
import Login from "./components/Authenticate/Login";
import SignUp from "./components/Authenticate/SignUp";
import NotFound from "./components/NotFound";
import PrivateRoute from "./PrivateRoute.js";
import ChangePass from "./components/User/ChangePass";
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
];
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

export default function App() {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser);

  store.subscribe(() => {
    setCurrentUser(store.getState());
  });


  useEffect(() => {
    store.dispatch({ type: 'user/updateUser' });
    const user = store.getState();
    if (user) {
      socket.emit("online", {ID: user.ID, name: user.name});
    }
  }, []);

  return (
    <Provider store={store}>

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
    </Provider>
  );
}
