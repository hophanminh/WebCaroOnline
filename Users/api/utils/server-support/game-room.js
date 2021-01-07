const model = require('../sql_command');
const config = require('../../config/default.json');

const rooms = [];
const Room = function (roomID, callTimeoutSocket) {
    this.roomID = roomID;
    this.user1 = {                      // temporary user 1
        ID: null,
        isReady: false
    }
    this.user2 = {                      // temporary user 2         
        ID: null,
        isReady: false
    }
    this.hasStart = false;
    this.currentTurnUserID = null;      // whose turn
    this.remain = null;                 // time remaining

    // reset timer function
    this.reset = (userID) => {                                                      // reset -> ask every player to reset timer
        this.currentTurnUserID = userID
        this.remain = config.timeout;
    }

    // call timer function
    this.callTimeoutSocket = callTimeoutSocket;
    this.timerFunction = () => {                                              // if remain === 0 -> socket announces that game ended
        if (this.remain === 0) {
            clearInterval(this.timerID);
            this.callTimeoutSocket(this.currentTurnUserID, this.roomID);
        }
        console.log(this.remain, this.user1.ID, this.user2.ID, this.currentTurnUserID, this.roomID, rooms.length);
        this.remain--;
    }
    this.timer = () => { return setInterval(this.timerFunction.bind(this), 1000) };
    this.timerID;
}

const getRoom = (roomID) => rooms.find((room) => room.roomID === roomID);

const createRoom = (roomID, callTimeoutSocket) => {
    if (roomID && !getRoom(roomID)) {
        const room = new Room(roomID, callTimeoutSocket);
        rooms.push(room);
        return room;
    }
    return null
}

const joinRoom = (userID1, userID2, roomID) => {
    const room = getRoom(roomID);
    if (room) {
        if (userID1) {
            room.user1.ID = userID1;
            room.user1.isReady = false;
        }
        if (userID2) {
            room.user2.ID = userID2;
            room.user2.isReady = false;
        }
    }
}

const leaveRoom = async (userID, roomID) => {
    const room = getRoom(roomID);
    if (room && room.hasStart === false) {              // if room exists and game hasn't started
        if (userID === room.user1.ID) {
            room.user1.ID = null;
            room.user1.isReady = false;
            await model.joinRoomAsPlayer1(roomID, null);
            return true;
        }
        if (userID === room.user2.ID) {
            room.user2.ID = null;
            room.user2.isReady = false;
            await model.joinRoomAsPlayer2(roomID, null);
            return true;
        }
    }
    return false;
}
const deleteRoom = (roomID) => {
    const index = rooms.findIndex((room) => room.roomID === roomID);

    if (index !== -1) {
        clearInterval(rooms[index].timerID)
        return rooms.splice(index, 1)[0]
    };
    return null;
}

const resetTimer = (userID, roomID) => {
    const room = getRoom(roomID);
    if (room) {
        room.reset(userID);
    }
}

const startTimer = (roomID) => {
    const room = getRoom(roomID);
    if (room) {
        room.hasStart = true;
        room.currentTurnUserID = room.user1.ID;
        room.remain = config.timeout;
        room.timerID = room.timer();
    }
}

const getRemain = (roomID) => {
    const room = getRoom(roomID);
    if (room) {
        return room.remain;
    }
    return -1;
}

const getReady = (roomID) => {
    const room = getRoom(roomID);
    if (room) {
        return { hasStart: room.hasStart, isReady1: room.user1.isReady, isReady2: room.user2.isReady };
    }
    return { hasStart: true, isReady1: true, isReady2: true };
}

const ready = (userID, roomID) => {
    const room = getRoom(roomID);
    if (room) {
        if (userID === room.user1.ID) {
            room.user1.isReady = !room.user1.isReady;
            return true;
        }
        if (userID === room.user2.ID) {
            room.user2.isReady = !room.user2.isReady;
            return true;
        }
    }
    return false;
}
module.exports = { getRoom, createRoom, joinRoom, leaveRoom, deleteRoom, resetTimer, startTimer, getRemain, getReady, ready };