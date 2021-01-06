const model = require('../utils/sql_command');
const { addUserToRoom, removeUserFromRoom, removeUserFromRoomWithID, getUser, getUsersInRoom } = require('./server-support/chatroom.query');
const { getRoomInfo, getGameInfo, checkValidMove, transformGameData, calculatePoints } = require('./server-support/game-logic');
const { getRoom, createRoom, joinRoom, leaveRoom, deleteRoom, resetTimer, startTimer, getRemain, getReady, ready } = require('./server-support/game-room');
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
    socket.on("manually_disconnect", async () => {
      if (!socket.user) {
        return;
      }
      console.log(socket.user.name + " disconnected");

      // Disconnect from chat room
      const user = removeUserFromRoom(socket.id);
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('usersInRoom', { room: user.room, users: getUsersInRoom(user.room) });
        if (await leaveRoom(user.userID, user.room)) {
          const { data } = await getRoomInfo(user.room);

          data[0]['remain'] = getRemain(user.room);
          data[0]['ready'] = getReady(user.room);
          io.to(user.room).emit('roomData', data);
        }
      }

      // decrease i of disconnected user. if i == 0 remove user from online list
      const ID = socket.user.ID;
      if (listOnlineUser[ID]) {
        delete listOnlineUser[ID];
      }
      const newList = Object.keys(listOnlineUser).map((key) => ({ ID: Number(key), name: listOnlineUser[key].name }));
      io.sockets.emit("get_online_users", newList);
    });
    // disconnect by leaving page
    socket.on("disconnect", async () => {
      if (!socket.user) {
        return;
      }
      console.log(socket.user.name + " disconnected");

      // Disconnect from chat room
      const user = removeUserFromRoom(socket.id);
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('usersInRoom', { room: user.room, users: getUsersInRoom(user.room) });

        if (await leaveRoom(user.userID, user.room)) {
          const { data } = await getRoomInfo(user.room);
          data[0]['remain'] = getRemain(user.room);
          data[0]['ready'] = getReady(user.room);
          io.to(user.room).emit('roomData', data);
        }
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
    socket.on("join", async ({ userID, name, room }, callback) => {
      const { data } = await getRoomInfo(room);

      // General room: Manager every users in room
      const { error, user } = addUserToRoom({ id: socket.id, name, room, userID });
      if (error) {
        callback();
      }
      else {
        // join and announce to everyone's chatroom
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        // update client of everyone in room
        data[0]['remain'] = getRemain(user.room);
        data[0]['ready'] = getReady(user.room);
        io.to(user.room).emit('roomData', data);
        io.to(user.room).emit('usersInRoom', { room: user.room, users: getUsersInRoom(user.room) });
        callback();
      }


      // Detail room: Manage room data (ready, player, timer)
      if (data[0].winner === -1) {
        createRoom(room, callTimeoutSocket)     // if there is no room yet => create room
        if (data[0].idUser1 === userID) {
          joinRoom(userID, null, room);
        }
        else if (data[0].idUser2 === userID) {
          joinRoom(null, userID, room);
        }

      }
    })
    const callTimeoutSocket = async (userID, roomID) => {       // call when someone's timeout
      const { data } = await getRoomInfo(roomID);
      if (userID === data[0].idUser1) {            // player 1 timeout
        data[0].winner = 2;
      }
      else if (userID === data[0].idUser2) {       // player 2 timeout
        data[0].winner = 1;
      }
      else {                                       // something's wrong
        data[0].winner = 0;
      }

      const { newScore1, newScore2 } = calculatePoints(data[0].score1, data[0].score2, data[0].winner);
      model.updateRoomWinner(roomID, data[0].winner);
      model.updateScore(data[0].idUser1, newScore1)
      model.updateScore(data[0].idUser2, newScore2)

      data[0].score1 = newScore1;
      data[0].score2 = newScore2;
      data[0]["remain"] = -1;
      data[0]['ready'] = getReady(roomID);
      io.to(roomID).emit('roomData', data);       // announce that the game ended

      deleteRoom(roomID);                        // remove timer
    }

    // leave room 
    socket.on("leave_room", async ({ userID, roomID }) => {
      // Leave General room
      const user = removeUserFromRoomWithID(socket.id, roomID);
      if (user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('usersInRoom', { room: user.room, users: getUsersInRoom(user.room) });
      }

      // Leave Detail room
      if (await leaveRoom(userID, roomID)) {                  // if leaving user is one of 2 players => update client
        const { data } = await getRoomInfo(roomID);
        data[0]['remain'] = getRemain(roomID);
        data[0]['ready'] = getReady(roomID);
        io.to(roomID).emit('roomData', data);
      }
    })


    // invite another user
    socket.on("invite", ({ ID1, name1, ID2 }) => {
      socket.join('invite_' + ID1 + '_' + ID2);
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
    const findPlayer = async () => {                  // find another player to queue
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

        const roomID = uuidv4();
        await model.createRoom([roomID, user1.ID, user2.ID])
          .then(() => {
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
    socket.on('get_room_data', async ({ ID }, callback) => {
      const { data } = await getRoomInfo(ID);
      const { gameData } = await getGameInfo(ID);

      data[0]['remain'] = getRemain(ID);
      data[0]['ready'] = getReady(ID);
      callback({ data, gameData });
    });
    // get chat message from server
    socket.on('get_chat_data', async ({ roomID }, callback) => {
      const chatData = await model.getMessageByRoomID(roomID);
      callback(chatData);
    });


    // announce that game has ended
    socket.on('game_finish', async ({ roomID, status }) => {
      const { data } = await getRoomInfo(roomID);

      if (status !== -1) {
        // update room when someone win
        if (status === 'X') {            // player 1 win
          data[0].winner = 1;
        }
        else if (status === 'O') {       // player 2 win
          data[0].winner = 2;
        }
        else if (status === '0') {      // draw
          data[0].winner = 0;
        }

        const { newScore1, newScore2 } = calculatePoints(data[0].score1, data[0].score2, data[0].winner);
        model.updateRoomWinner(roomID, data[0].winner);
        model.updateScore(data[0].idUser1, newScore1)
        model.updateScore(data[0].idUser2, newScore2)

        data[0].score1 = newScore1;
        data[0].score2 = newScore2;
        data[0]["remain"] = -1;
        data[0]['ready'] = getReady(roomID);
        io.to(roomID).emit('roomData', data);
        deleteRoom(roomID);
      }
    });


    // chat
    socket.on('sendMessage', ({ message, userID, roomID }, callback) => {
      const user = getUser(socket.id);

      // save to database
      model.createMessage(message, userID, roomID);

      // annouce to other players
      io.to(roomID).emit('message', { user: user.name, text: message });
      callback();
    });


    // play caro
    socket.on('play', async ({ move, userID, roomID, turn }, callback) => {
      const data = await model.getRoomByID(roomID);
      const moves = await model.getMoveByRoomID(roomID);
      const checkReady = getReady(roomID);
      // check if move's valid
      if (checkReady.hasStart && checkValidMove(move, userID, data, moves)) {
        resetTimer(userID, roomID)                              // reset timer
        callback(true);                                         // update client
        // add new move to database
        model.createMove(move, userID, roomID, turn)
        socket.broadcast.to(roomID).emit('wait_new_move', move);
      }
      else {
        callback(false);
      }
    });


    // create timer when both players are ready
    socket.on('ready', async ({ userID, roomID }) => {
      if (ready(userID, roomID)) {
        const ready = getReady(roomID);
        if (ready.isReady1 && ready.isReady2) {
          startTimer(roomID);
        }
        const { data } = await getRoomInfo(roomID);
        data[0]['remain'] = getRemain(roomID);
        data[0]['ready'] = getReady(roomID);
        io.to(roomID).emit('roomData', data);
      }
    });

    // reset timer when someone plays
    socket.on('reset', async ({ userID, roomID }) => {
      resetTimer(userID, roomID)
    });

  });
}
