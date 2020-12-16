const model = require('../utils/sql_command');
const { addUserToRoom, removeUserFromRoom, getUser, getUsersInRoom, getRoomInfo, checkValidMove, checkWinCondition } = require('../utils/chatroom.query');
require('express-async-errors');

module.exports = function (io) {
  let listOnlineUser = {};

  io.on("connection", (socket) => {

    socket.on("online", (user) => {
      socket.user = user;

      // add new user to online list
      if (!listOnlineUser[user.ID]) {
        listOnlineUser[user.ID] = { name: user.name, i: 0 };    // i is number of tab of one account
      }
      listOnlineUser[user.ID].i++;

      const newList = Object.keys(listOnlineUser).map((key) => ({ ID: Number(key), name: listOnlineUser[key].name }));
      io.sockets.emit("get_online_users", newList);
    });

    // get online users
    socket.on("alert_online_users", () => {

      const newList = Object.keys(listOnlineUser).map((key) => ({ ID: Number(key), name: listOnlineUser[key].name }));
      io.sockets.emit("get_online_users", newList);
    });

    // sign out
    socket.on("manually_disconnect", () => {
      if (!socket.user) {
        return;
      }
      console.log(socket.user.name + " disconnected");

      // Disconnect from chat room
      const user = removeUserFromRoom(socket.id);
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('usersInRoom', { room: user.room, users: getUsersInRoom(user.room) });
      }

      // decrease i of disconnected user. if i == 0 remove user from online list
      const ID = socket.user.ID;
      if (listOnlineUser[ID]) {
        delete listOnlineUser[ID];
      }
      const newList = Object.keys(listOnlineUser).map((key) => ({ ID: Number(key), name: listOnlineUser[key].name }));
      io.sockets.emit("get_online_users", newList);
    });

    // disconnect is fired when a client leaves the server (leave page)
    socket.on("disconnect", () => {
      if (!socket.user) {
        return;
      }
      console.log(socket.user.name + " disconnected");

      // Disconnect from chat room
      const user = removeUserFromRoom(socket.id);
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('usersInRoom', { room: user.room, users: getUsersInRoom(user.room) });
      }

      // decrease i when user disconnected. if i == 0 remove user from online list
      const ID = socket.user.ID;
      if (listOnlineUser[ID]) {
        listOnlineUser[ID].i--;
        if (listOnlineUser[ID].i === 0) {
          delete listOnlineUser[ID];
        }
      }
      const newList = Object.keys(listOnlineUser).map((key) => ({ ID: Number(key), name: listOnlineUser[key].name }));
      io.sockets.emit("get_online_users", newList);
    });


    // join new room
    socket.on("join", async ({ name, room }, callback) => {
      /* Model User of chat room
       * User {socketId, username, roomId}
       */
      const { error, user } = addUserToRoom({ id: socket.id, name, room });

      if (error === 'Already joined.') return callback();    // skip joining 
      if (error) return callback(error);

      // join and announce to everyone
      socket.join(user.room);
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });


      // send data to every user in room
      const { data, gameData } = await getRoomInfo(user.room);
      io.to(user.room).emit('roomData', { data, gameData });
      io.to(user.room).emit('usersInRoom', { room: user.room, users: getUsersInRoom(user.room) });

      callback();
    })

    socket.on('get_room_data', async (ID) => {
      const { data, gameData } = await getRoomInfo(ID);
      socket.emit('roomData', { data, gameData });
    });

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);

      io.to(user.room).emit('message', { user: user.name, text: message });

      callback();
    });

    socket.on('play', async ({ move, userID, boardID, turn }) => {
      const data = await model.getRoomByID(boardID);
      const moves = await model.getMoveByRoomID(boardID);

      // check if move's valid
      if (await checkValidMove(move, userID, data, moves)) {
        // add new move to database
        await model.createMove(move, userID, boardID, turn);

        // check win condition
        const newMoves = moves.concat({
          position: move,
        });
        const result = checkWinCondition(newMoves, turn, move);
        // update room when someone win
        if (result.status === 'X') {            // player 1 win
          await model.updateRoomWinner(boardID, 1)
        }
        else if (result.status === 'O') {       // player 2 win
          await model.updateRoomWinner(boardID, 2)
        }
        else if (result.status === '-1') {      // draw
          await model.updateRoomWinner(boardID, 0)
        }
        if (result.line) {
          for (let i = 0; i < result.line.length; i++) {
            await model.updateMoveLine(result.line[i]);
          }
        }

        // send data to every user in room
        const { data, gameData } = await getRoomInfo(boardID);
        io.to(boardID).emit('roomData', { data, gameData });
      }
    });

  });
}
