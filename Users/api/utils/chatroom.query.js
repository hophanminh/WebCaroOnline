const users = [];

const addUserToRoom = ({ id, name, room }) => {

    // username = username.trim().toLowerCase();
    // roomId = roomId.trim().toLowerCase();

    const existingUser =
        users.find((user) =>
            user.room === room && user.name === name
        );

    if(!name || !room) {
        return {
            error: 'Username and room are required.'
        };
    }

    if(existingUser) {
        return {
            error: 'Username is taken.'
        };
    }

    const user = {
        id, name, room
    };

    users.push(user);

    return { user };
}

const removeUserFromRoom = (socketId) => {
    const index = users.findIndex((user) => user.id === socketId);

    if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (socketId) => users.find((user) => user.id === socketId);

const getUsersInRoom = (roomId) => users.filter((user) => user.room === roomId);

module.exports = { addUserToRoom, removeUserFromRoom, getUser, getUsersInRoom };