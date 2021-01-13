import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import TableChartIcon from '@material-ui/icons/TableChart';
import { BsFillBarChartFill } from "react-icons/bs";
import {
  NavLink
} from "react-router-dom";
import store from '../../utils/store.service';


export default function SideBarList(props) {
  const [currentUser, setCurrentUser] = useState();

  store.subscribe(() => {
    setCurrentUser(store.getState().user);
  });

  return (
    <div>
      <ListItem button component={NavLink} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      {currentUser && (
        <ListItem button component={NavLink} to="/Account">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
      )}
      {currentUser && (
        <ListItem button component={NavLink} to="/Password">
          <ListItemIcon>
            <LockOpenIcon />
          </ListItemIcon>
          <ListItemText primary="Password" />
        </ListItem>
      )}
      {currentUser && (
        <ListItem button component={NavLink} to="/History">
          <ListItemIcon>
            <TableChartIcon />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
      )}
      {currentUser && (
          <ListItem button component={NavLink} to="/Ranking">
            <ListItemIcon>
              <BsFillBarChartFill style={{ fontSize: 25 }} />
            </ListItemIcon>
            <ListItemText primary="Ranking" />
          </ListItem>
      )}
    </div>
  )
};