const model = require('./sql_command');
const config = require('../config/default.json');

const users = [];

const addUserToRoom = ({ id, name, room }) => {
    if (name != null) {
        name = name.trim().toLowerCase();
        const existingUser = users.find((user) => user.room === room && user.name === name);
        if (existingUser) return { error: 'Already joined.' };

    }
    room = room.trim().toLowerCase();

    //if (!name || !room) return { error: 'Username and room are required.' };

    const user = { id, name, room };

    users.push(user);
    return { user };
}

const removeUserFromRoom = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
}

const removeUserFromRoomWithID = (id, roomID) => {
    console.log("leaving")
    const index = users.findIndex((user) => user.id === id && user.room === roomID);

    if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (socketId) => users.find((user) => user.id === socketId);

const getUsersInRoom = (roomId) => users.filter((user) => user.room === roomId);

const getRoomInfo = async (id) => {
    if (id != null) {
        const data = await model.getRoomByID(id);
        const moves = await model.getMoveByRoomID(id);
        const gameData = transformGameData(moves);

        const result = await model.getWinningLine(id);
        const winningLine = result.map((i) => i.position);
        gameData["winningLine"] = winningLine;
        return { data, gameData };
    }
}

const transformGameData = (moves) => {
    const row = config.row;
    const column = config.column;
    let history = [{
        squares: Array(column * row).fill(null),
        move: -1,
    }];
    stepNumber = 0;
    xIsNext = true;

    if (moves && moves !== undefined && moves.length != 0) {
        stepNumber = moves.length;
        xIsNext = (moves.length % 2) === 0 ? true : false;

        const squares = Array(column * row).fill(null);
        for (let i = 0; i < moves.length; i++) {
            const pos = moves[i].position;
            const turn = i + 1;
            const current = (turn % 2) === 0 ? 'O' : 'X';

            squares[pos] = current;
            history.push({
                squares: squares.slice(),
                move: pos,
            });
        }
    }
    return { history, stepNumber, xIsNext };
}

const checkValidMove = (move, userID, data, moves) => {
    if (data[0].winner != -1) {
        return false;                                                       // game was finished
    }
    if (!userID) {                                                          // not login
        return false;
    }
    if (!data[0].idUser1 || !data[0].idUser2) {                             // not enough player
        return false;
    }
    if (userID != data[0].idUser1 && userID != data[0].idUser2) {           // not a player
        return false;
    }
    if (move >= config.row * config.column) {                               // move is out of bound
        return false;
    }
    if (moves.length === 0 && data[0].idUser1 != userID) {
        return false;
    }
    if (moves.length != 0) {
        const current = moves[moves.length - 1];
        if (current.userID === userID) {                                        // wrong turn 
            return false;
        }
        if (moves.findIndex((i) => { return i.position == move }) != -1) {          // move has already played
            return false;
        }
    }
    return true;
}

module.exports = {users, addUserToRoom, removeUserFromRoom, removeUserFromRoomWithID, getUser, getUsersInRoom, getRoomInfo, checkValidMove, transformGameData };