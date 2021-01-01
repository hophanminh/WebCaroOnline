const model = require('../sql_command');
const config = require('../../config/default.json');

const users = [];

const addUserToRoom = ({ id, name, room, userID }) => {
    if (name != null) {
        name = name.trim().toLowerCase();
        const existingUser = users.find((user) => user.room === room && user.name === name);
        if (existingUser) return { error: 'Already joined.' };

    }
    room = room.trim().toLowerCase();

    //if (!name || !room) return { error: 'Username and room are required.' };

    const user = { id, name, room, userID };

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

module.exports = { addUserToRoom, removeUserFromRoom, removeUserFromRoomWithID, getUser, getUsersInRoom };