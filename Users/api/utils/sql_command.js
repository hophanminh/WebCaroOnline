const db = require("./database");
const config = require("../config/default.json");

module.exports = {
    getUserByID: (ID) =>
        db.loadSafe(`SELECT *
                FROM user
                WHERE ID = ? `, [ID]),

    getUserByUsername: (username) =>
        db.loadSafe(`SELECT *
                FROM user
                WHERE username = ? `, [username]),

    getUserByEmail: (email) =>
        db.loadSafe(`SELECT *
                FROM user
                WHERE email = ? `, [email]),

    getUserByNameOrEmail: ({ username, email }) =>
        db.loadSafe(`SELECT *
            FROM user
            WHERE username = ? OR email = ?`, [username, email]),

    login: ({ username, password }) =>
        db.loadSafe(`SELECT *
                FROM user
                WHERE username = ? AND password = ?`, [username, password]),

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
            status: config.status.INACTIVE,
        }
        return db.add(`user`, newUser)
    },

    getOnlineRoomList: () =>
        db.loadSafe(`SELECT r.* , u1.username as name1, u2.username as name2
                    FROM room as r  LEFT JOIN user as u1 ON r.idUser1 = u1.ID
                                    LEFT JOIN user as u2 ON r.idUser2 = u2.ID
                    WHERE r.winner = -1
                    ORDER By r.dateCreate DESC`, []),

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

    getWinningLine: (ID) =>
        db.loadSafe(`SELECT m.position
                        FROM move as m
                        WHERE m.roomID = ? AND m.winningLine = 1`, [ID]),
    getMessageByRoomID: (ID) =>
        db.loadSafe(`SELECT u.username as user, m.message as text
                    FROM message as m LEFT JOIN user as u ON m.userID = u.ID
                    WHERE roomID = ?
                    ORDER BY m.dateCreate ASC`, [ID]),

    createRoom: ([roomID, ID1, ID2]) => {
        const dateCreate = new Date();
        const newRoom = {
            ID: roomID,
            dateCreate: dateCreate,
            idUser1: ID1,
            idUser2: ID2,
            winner: -1,
        }
        return db.add(`room`, newRoom)
    },

    updateRoomWinner: (roomID, winner) =>
        db.loadSafe(`UPDATE room
                    SET winner = ?
                    WHERE ID = ?`, [winner, roomID]),

    joinRoomAsPlayer1: (roomID, userID) =>
        db.loadSafe(`UPDATE room
                    SET idUser1 = ?
                    WHERE ID = ?`, [userID, roomID]),

    joinRoomAsPlayer2: (roomID, userID) =>
        db.loadSafe(`UPDATE room
                    SET idUser2 = ?
                    WHERE ID = ?`, [userID, roomID]),

    createMove: (move, userID, roomID, turn) => {
        const newMove = {
            roomID: roomID,
            userID: userID,
            turn: turn,
            position: move,
        }
        return db.add(`move`, newMove)
    },

    updateMoveLine: (pos) =>
        db.loadSafe(`UPDATE move
                    SET winningLine = 1
                    WHERE position = ?`, [pos]),


    activeUser: (hashLink) => {
        const sql = `UPDATE user SET status = ${config.status.ACTIVE} WHERE id = (SELECT userId from pageverrify WHERE hashLink = '${hashLink}')`
        return db.load(sql);
    },

    updateVerrifyPage: (hashLink) => {
        const sql = `UPDATE pageverrify SET status = 1 WHERE hashLink = '${hashLink}'`
        return db.load(sql);
    },

    saveHashLinkToPageVerrify: (userId, hashLink) => {
        const verrifyAccount = {
            userId: userId,
            hashLink: hashLink,
            createdDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }
        return db.add("pageverrify", verrifyAccount);
    },
    getUserIdByUUID: (uuid) => {
        return db.load(`SELECT userId
                        FROM pageverrify
                        WHERE hashLink = '${uuid}'`)
    },
    resetPassword: (userId, hash) => {
        const sql = `UPDATE user SET password = '${hash}' WHERE id = ${userId}`
        return db.load(sql);
    }

    createMessage: (message, userID, roomID) => {
        const newMessage = {
            roomID: roomID,
            userID: userID,
            message: message,
            dateCreate: new Date(),
        }
        return db.add(`message`, newMessage)
    },



};