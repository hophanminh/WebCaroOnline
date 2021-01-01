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
                WHERE ID = ?`, [ID]),

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
    },
    getMatchesByUserId(userID) {
        const sql = `SELECT * from room WHERE idUser1 = ${userID} OR idUser2 = ${userID}`;
        return db.loadSafe(sql);
    }


    getFinishRoomListByUserID: (userID) =>
        db.loadSafe(`SELECT r.* , u1.username as name1, u2.username as name2, u1.score as score1, u2.score as score2, r.winner as winner
                FROM room as r  LEFT JOIN user as u1 ON r.idUser1 = u1.ID
                                LEFT JOIN user as u2 ON r.idUser2 = u2.ID
                WHERE r.winner <> -1 AND (u1.ID = ? OR u2.ID = ?)
                ORDER By r.dateCreate DESC`, [userID, userID]),

    getRoomByID: (ID) =>
        db.loadSafe(`SELECT r.ID, r.idUser1, r.idUser2 , u1.username as name1, u2.username as name2, u1.score as score1, u2.score as score2, r.winner as winner
        FROM room as r  LEFT JOIN user as u1 ON r.idUser1 = u1.ID
                        LEFT JOIN user as u2 ON r.idUser2 = u2.ID
        WHERE r.ID = ? `, [ID]),

    getMoveByRoomID: (ID) =>
        db.loadSafe(`SELECT *
            FROM move
            WHERE roomID = ? `, [ID]),

    getMessageByRoomID: (ID) =>
        db.loadSafe(`SELECT u.username as user, m.message as text
                        FROM message as m LEFT JOIN user as u ON m.userID = u.ID
                        WHERE roomID = ?
                        ORDER BY m.dateCreate ASC`, [ID]),


};