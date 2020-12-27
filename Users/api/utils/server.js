const model = require('../utils/sql_command');
const { addUserToRoom, removeUserFromRoom, getUser, getUsersInRoom, getRoomInfo, checkValidMove, checkWinCondition, transformGameData } = require('../utils/chatroom.query');
require('express-async-errors');
const { v4: uuidv4 } = require('uuid');

module.exports = function (io) {
  let listOnlineUser = {};
  const quickPlayQueue = [];

  io.on("connection", (socket) => {

    // online user
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

    // invite another user
    socket.on("invite", ({ ID1, name1, ID2 }) => {
      socket.join('invite_' + ID1 + '_' + ID2);
      console.log(io.sockets.adapter.rooms)
      io.sockets.emit('waiting_for_invite_' + ID2, {
        ID: ID1,
        name: name1,
        dateCreate: Date.now(),
      });
    })

    // answer invitation
    socket.on("answer_invite", async ({ ID1, ID2, answer }) => {
      const name = 'invite_' + ID1 + '_' + ID2;
      socket.join(name);
      const listUser = io.sockets.adapter.rooms.get(name);

      // check if user is still in room
      if (answer) {                                               // accept
        if (listUser && listUser.size > 1) {                       // accept's a success
          // create new room
          const roomID = uuidv4();
          await model.createRoom([roomID, ID1, ID2])
            .then(() => {
              io.to(name).emit('waitng_accept', { status: true, ID: roomID });
            });
        }
        else {
          socket.emit('waitng_accept', { status: false });       // timeout
        }
      }
      else {                                                    // refuse
        if (listUser && listUser.size > 1) {
          io.to(name).emit('waitng_accept', { status: false });
        }
      }
      socket.leave(name)
    })

    // stop waitng for invitation's answer
    socket.on("stop_invite", ({ ID1, ID2 }) => {
      const name = 'invite_' + ID1 + '_' + ID2;
      socket.leave(name);
    })

    // Quick play
    socket.on("quick_play", ({ ID, point }) => {
      const index = quickPlayQueue.findIndex((user) => user.ID === ID);
      if (index === -1) {
        quickPlayQueue.push({ ID: ID, point: point });
      };
      socket.join("waiting_room")
      findPlayer();
    })

    const findPlayer = async () => {
      if (quickPlayQueue.length >= 2) {
        const user1 = quickPlayQueue[0];               // take the oldest user
        let user2;
        let diff = 50;
        do {                                                                          // find user2 with point that is +-50 to user1's point
          for (let i = 1; i < quickPlayQueue.length; i++) {                           // diff +50 for each loop and stop when at 500
            if (Math.abs(quickPlayQueue[i].point - user1.point) <= diff) {    
              user2 = quickPlayQueue[i];
              break;
            }
          }
          diff += 50;
        } while (diff <= 500);

        quickPlayQueue.splice(0, 1);
        quickPlayQueue.splice(0, 1);

        console.log("here", user1, user2);
        const roomID = uuidv4();
        await model.createRoom([roomID, user1.ID, user2.ID])
          .then(() => {
            console.log(user1.ID, user2.ID)
            io.to("waiting_room").emit('waiting_room_' + user1.ID, { status: true, ID: roomID });
            io.to("waiting_room").emit('waiting_room_' + user2.ID, { status: true, ID: roomID });
          });
      }
    }

    // stop quick play
    socket.on("stop_quick_play", ({ ID }) => {
      const index = quickPlayQueue.findIndex((user) => user.ID === ID);
      if (index !== -1) {
        quickPlayQueue.splice(index, 1);
      };
    })



    // get Room data from server
    socket.on('get_room_data', async (ID) => {
      const { data, gameData } = await getRoomInfo(ID);
      socket.emit('roomData', { data, gameData });
    });


    // chat
    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);

      io.to(user.room).emit('message', { user: user.name, text: message });

      callback();
    });


    // play caro
    socket.on('play', async ({ move, userID, boardID, turn }) => {
      const data = await model.getRoomByID(boardID);
      const moves = await model.getMoveByRoomID(boardID);

      // check if move's valid
      if (checkValidMove(move, userID, data, moves)) {
        // add new move to database
        await model.createMove(move, userID, boardID, turn);

        // check win condition
        const newMoves = moves.concat({
          position: move,
        });
        const result = checkWinCondition(newMoves, turn, move);
        // update room when someone win
        if (result.status === 'X') {            // player 1 win
          model.updateRoomWinner(boardID, 1);
          data[0].winner = 1;
        }
        else if (result.status === 'O') {       // player 2 win
          model.updateRoomWinner(boardID, 2);
          data[0].winner = 2;
        }
        else if (result.status === '-1') {      // draw
          model.updateRoomWinner(boardID, 0);
          data[0].winner = 0;
        }
        let winningLine = [];
        if (result.line) {
          for (let i = 0; i < result.line.length; i++) {
            model.updateMoveLine(result.line[i]);
            winningLine.push(result.line[i])
          }
        }

        // get game data
        const gameData = transformGameData(newMoves);
        gameData["winningLine"] = winningLine;
        // send data to every user in room
        io.to(boardID).emit('roomData', { data, gameData });
      }

    });

  });
}
