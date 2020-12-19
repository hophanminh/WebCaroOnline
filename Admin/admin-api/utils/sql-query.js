const db = require("./database");
const config = require("../config/default-config.json");

module.exports = {
    getUsers: () => {
        const sql = `SELECT * FROM user`
        return db.loadSafe(sql);
    },

    getUserByID: (ID) =>
        db.loadSafe(`SELECT *
                FROM user
                WHERE ID = ? AND permission = ${config.PERMISSION.ADMIN}`, [ID]),

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
                WHERE username = ? AND password = ? AND permission = ${config.PERMISSION.ADMIN}`, [username, password]),

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
            status: config.STATUS.ACTIVE,
            permission: config.PERMISSION.ADMIN
        }
        return db.add(`user`, newUser)
    },
    banUser(ID) {
        return db.loadSafe(`UPDATE user set status = ${config.STATUS.INACTIVE} where id = ${ID}`);
    },
    unbanUser(ID) {
        return db.loadSafe(`UPDATE user u set u.status = ${config.STATUS.ACTIVE} where id = ${ID}`)
    },
    getMatches() {
        return db.loadSafe(`SELECT * FROM room`);
    },
    getMatch(UUIDMatch) {
        return db.loadSafe(`SELECT * FROM room WHERE ID = ${UUIDMatch}`)
    }
};