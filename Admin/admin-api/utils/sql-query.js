const db = require("./database");
const config = require("../config/default-config.json");

module.exports = {
    getUserByID: (ID) =>
        db.loadSafe(`SELECT *
                FROM user
                WHERE ID = ? AND permission = ${config["admin-permission"]}`, [ID]),

    getUserByUsername: (username) =>
        db.loadSafe(`SELECT *
                FROM user
                WHERE username = ?`, [username]),

    getUserByEmail: (email) =>
        db.loadSafe(`SELECT *
                FROM user
                WHERE email = ?`, [email]),

    getUserByNameOrEmail: ({ username, email }) =>
        db.loadSafe(`SELECT *
            FROM user
            WHERE username = ? OR email = ?`, [username, email]),

    login: ({ username, password }) =>
        db.loadSafe(`SELECT *
                FROM user
                WHERE username = ? AND password = ? AND permission = ${config["admin-permission"]}`, [username, password]),

    updateUser: (entity) => {
        const condition = { ID: entity.ID };
        delete entity.ID;
        return db.patch(`user`, entity, condition);
    },

    register: ([username, password, email, fullname]) => {
        const newUser = {
            username: username,
            password: password,
            email: email,
            fullname: fullname,
            status: 1,
            permission: config["admin-permission"]
        }
        return db.add(`user`, newUser)
    },
};