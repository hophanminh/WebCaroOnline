const model = require('../utils/sql_command');
require('express-async-errors');

module.exports = function (io) {
  let listOnlineUser = {};
  io.on("connection", socket => {

    socket.on("online", (user) => {
      socket.user = user;

      // add new user to online list
      if (!listOnlineUser[user.ID]) {
        listOnlineUser[user.ID] = { name: user.name, i: 0 };    // i is number of tab of one account
      }
      listOnlineUser[user.ID].i++;

      const newList = Object.keys(listOnlineUser).map((key) => ({ID: Number(key), name: listOnlineUser[key].name}));
      io.sockets.emit("get_online_users", newList);
    });

    // get online users
    socket.on("alert_online_users", () => {

      const newList = Object.keys(listOnlineUser).map((key) => ({ID: Number(key), name: listOnlineUser[key].name}));
      io.sockets.emit("get_online_users", newList);
    });




    // sign out
    socket.on("manually_disconnect", (user) => {
      if (!socket.user) {
        return;
      }
      console.log(socket.user.name + " disconnected");

      // decrease i of disconnected user. if i == 0 remove user from online list
      const ID = socket.user.ID;
      if (listOnlineUser[ID]) {
        delete listOnlineUser[ID];
      }
      const newList = Object.keys(listOnlineUser).map((key) => ({ID: Number(key), name: listOnlineUser[key].name}));
      io.sockets.emit("get_online_users", newList);
    });



    // disconnect is fired when a client leaves the server (leave page)
    socket.on("disconnect", () => {
      if (!socket.user) {
        return;
      }
      console.log(socket.user.name + " disconnected");

      // decrease i of disconnected user. if i == 0 remove user from online list
      const ID = socket.user.ID;
      if (listOnlineUser[ID]) {
        listOnlineUser[ID].i--;
        if (listOnlineUser[ID].i === 0) {
          delete listOnlineUser[ID];
        }
      }
      const newList = Object.keys(listOnlineUser).map((key) => ({ID: Number(key), name: listOnlineUser[key].name}));
      io.sockets.emit("get_online_users", newList);
    });
  });
}
