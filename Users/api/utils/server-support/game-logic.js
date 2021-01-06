const model = require('../sql_command');
const config = require('../../config/default.json');

const getRoomInfo = async (id) => {
    if (id != null) {
        try {
            const data = await model.getRoomByID(id);
            return { data };
        } catch (error) {
            console.log(error);
        }
    }
}

const getGameInfo = async (id) => {
    if (id != null) {
        try {
            const moves = await model.getMoveByRoomID(id);
            const gameData = transformGameData(moves);
            return { gameData };
        } catch (error) {
            console.log(error);
        }
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

const calculatePoints = (score1, score2, status) => {

    if (status === 0) {
        return { newScore1: score1, newScore2: score2 };
    }

    const defaultPoint = config["point_reward"];
    const diff = Math.abs(score1 - score2);

    let newScore1 = score1;
    let newScore2 = score2;

    if (status === 1) {
        newScore1 += defaultPoint;
        newScore2 -= defaultPoint;
    }
    else if (status === 2) {
        newScore1 -= defaultPoint;
        newScore2 += defaultPoint;
    }

    if (diff >= 200) {
        const upsetPoint = diff * 10 / 100;
        if (status === 1 && score1 < score2) {                           // if player 1 win and has lower score than player 2
            newScore1 += upsetPoint;
            newScore2 -= upsetPoint;
        }
        if (status === 2 && score1 > score2) {                           // if player 1 lose and has higher score than player 2
            newScore1 -= upsetPoint;
            newScore2 += upsetPoint;
        }
    }

    // prevent negative score
    newScore1 = newScore1 >= 0 ? newScore1 : 0;
    newScore2 = newScore2 >= 0 ? newScore2 : 0;

    return { newScore1: newScore1, newScore2: newScore2 }
}

module.exports = { getRoomInfo, getGameInfo, checkValidMove, transformGameData, calculatePoints };