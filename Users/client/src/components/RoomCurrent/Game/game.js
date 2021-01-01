import React, { useState, useEffect } from "react";
import './game.css';
import Board from './board.js';
import {
    Box,
    Grid,
    Button,
    CircularProgress,
    makeStyles,
    Typography
} from '@material-ui/core';
import socket from "../../../utils/socket.service";
import store from "../../../utils/store.service";
import config from "../../../utils/config.json";

const useStyles = makeStyles((theme) => ({
    rightContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    infoContainer: {
        width: '100%',
    },
    turnContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflowY: 'auto',
        marginBottom: '10px',
        borderBottom: '1px solid #999'
    },

    readyContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    buttonContainer: {
        minHeight: '36px',
        maxHeight: '36px',
        width: '100%',
    }
}));

function Game(props) {
    const classes = useStyles();

    // change these to change the size of the board
    const squareSize = config["square-size"];
    const column = config.column;
    const row = config.row;
    const gameData = props.gameData;
    const roomData = props.roomData;

    const [history, setHistory] = useState();
    const [stepNumber, setStepNumber] = useState();
    const [xIsNext, setXIsNext] = useState();
    const [newMove, setNewMove] = useState(-1);

    useEffect(() => {
        // set innitial data
        if (gameData) {
            setHistory(gameData.history);
            setStepNumber(gameData.stepNumber);
            setXIsNext(gameData.xIsNext);
        }

        // wait for new move
        socket.on('wait_new_move', setNewMove);

        return () => {
            socket.off("wait_new_move");
        }
    }, [gameData]);

    useEffect(() => {
        if (newMove !== -1) {
            receiveMove(newMove);
            props.setReset(true);
        }
    }, [newMove]);

    const receiveMove = (newMove) => {
        if (newMove !== -1 && history) {
            // handle click
            const newHistory = history.slice(0, stepNumber + 1);
            const current = newHistory[newHistory.length - 1];
            const squares = current.squares.slice();

            squares[newMove] = xIsNext ? 'X' : 'O';
            setHistory(
                newHistory.concat([{
                    squares: squares,
                    move: newMove,
                }])
            );
            setStepNumber(newHistory.length);
            setXIsNext(!xIsNext);
        }
    }

    const calculateWinner = (squares, stepNumber, move) => {
        const row = 50;
        const column = 50;
        const win = 5;

        //  illegal move
        if (move === -1) {
            return ({
                line: null,
                status: -1,
            })
        }

        // 1d array to 2d array
        const x = Math.floor(move / column);
        const y = move % column;

        // check column
        let line = [];
        for (let i = 0 - win; i < win; i++) {
            const tempX = x + i;
            // skip line start from outside and line too short
            if (tempX < 0 || tempX > row) {
                continue;
            }
            // if line has at least 1 square, check next square
            if (line.length !== 0 && squares[line[0]] !== squares[tempX * column + y]) {
                line = [];
            }
            // ignore empty square
            if (squares[tempX * column + y] !== null) {
                line.push(tempX * column + y);
            }
            // check if line's length == win
            if (line.length === win) {
                return ({
                    line: line,
                    status: squares[x * column + y],
                })

            }
        }

        // check row
        line = [];
        for (let i = 0 - win; i < win; i++) {
            const tempY = y + i;
            // skip line start from outside and line too short
            if (tempY < 0 || tempY > column) {
                continue;
            }
            // if line has at least 1 square, check next square
            if (line.length !== 0 && squares[line[0]] !== squares[x * column + tempY]) {
                line = [];
            }
            // ignore empty square
            if (squares[x * column + tempY] !== null) {
                line.push(x * column + tempY);
            }
            // check if line's length == win
            if (line.length === win) {
                return ({
                    line: line,
                    status: squares[x * column + y],
                })

            }
        }

        // check diagonal
        line = [];
        for (let i = 0 - win; i < win; i++) {
            const tempX = x + i;
            const tempY = y + i;

            // skip line start from outside and line too short
            if (tempX < 0 || tempX > row || tempY < 0 || tempY > column) {
                continue;
            }
            // if line has at least 1 square, check next square
            if (line.length !== 0 && squares[line[0]] !== squares[tempX * column + tempY]) {
                line = [];
            }
            // ignore empty square
            if (squares[tempX * column + tempY] !== null) {
                line.push(tempX * column + tempY);
            }
            // check if line's length == win
            if (line.length === win) {
                return ({
                    line: line,
                    status: squares[x * column + y],
                })

            }
        }

        // check anti-diagonal
        line = [];
        for (let i = 0 - win; i < win; i++) {
            const tempX = x + i;
            const tempY = y - i;

            // skip line start from outside and line too short
            if (tempX < 0 || tempX > row || tempY < 0 || tempY > column) {
                continue;
            }
            // if line has at least 1 square, check next square
            if (line.length !== 0 && squares[line[0]] !== squares[tempX * column + tempY]) {
                line = [];
            }
            // ignore empty square
            if (squares[tempX * column + tempY] !== null) {
                line.push(tempX * column + tempY);
            }
            // check if line's length == win
            if (line.length === win) {
                return ({
                    line: line,
                    status: squares[x * column + y],
                })

            }
        }

        // check draw
        if (stepNumber === column * row) {
            return ({
                line: null,
                status: 0,
            })
        }

        // game continues
        return ({
            line: null,
            status: -1,
        })
    }

    const handleClick = (i, previousMove) => {
        // handle click
        const newHistory = history.slice(0, stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();

        // check if move is valid locally
        const checkFinish = calculateWinner(squares, stepNumber, previousMove);
        if (checkFinish.status !== -1 || squares[i]) {
            return;
        }

        // check if move is valid on server
        const user = store.getState().user;
        socket.emit("play", { move: i, userID: user.ID, roomID: props.roomID, turn: stepNumber + 1 },
            (isValid) => {                  // callback after server check
                if (isValid) {
                    squares[i] = xIsNext ? 'X' : 'O';

                    setHistory(
                        newHistory.concat([{
                            squares: squares,
                            move: i,
                        }])
                    );
                    setStepNumber(newHistory.length);
                    setXIsNext(!xIsNext);

                    // check win
                    const checkFinish = calculateWinner(squares, stepNumber, i);
                    if (checkFinish.status !== -1) {
                        socket.emit("game_finish", { roomID: props.roomID, status: checkFinish.status });
                    }
                    else {
                        console.log('here');
                        props.setReset(true);           // reset timer if game continues
                    }
                }
            }
        );

    }

    const handleReady = (i) => {
        const user = store.getState().user;
        socket.emit("ready", { userID: user.ID, roomID: props.roomID })
    }


    if (!history || !roomData) {
        return (<CircularProgress />)
    }
    else {
        const current = history[stepNumber];
        const winner = calculateWinner(current.squares, stepNumber, current.move);

        const moves = history.map((turn, i) => {
            const x = Math.floor(turn.move / column);
            const y = turn.move % column;

            const player = (i % 2) === 0 ? "O" : "X";

            const desc = i ?
                'Turn ' + i + ': (' + x + ',' + y + ') - ' + player :
                'Game start';

            return (
                <li key={i}>
                    {current === turn ? <b>{desc}</b> : <>{desc}</>}
                </li>
            );
        });

        let statusDes;
        const finalMoves = moves.slice().reverse();
        if (winner.status === -1) {
            statusDes = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
        else if (winner.status === 0) {
            statusDes = 'Draw';
        }
        else {
            statusDes = 'Winner: ' + winner.status;
        }

        return (
            <Box className="game" >
                <Grid container spacing={3} >
                    <Grid item xs={8} >
                        <Box width="95%" height={290} overflow="auto">
                            <Box className="gameContainer" height={squareSize * row} width={squareSize * column}>
                                <Board
                                    column={column}
                                    row={row}
                                    squares={current.squares}
                                    onClick={(i) => handleClick(i, current.move)}
                                    winnerLine={winner.line}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        {roomData.ready && roomData.ready.hasStart &&
                            (<Box className={classes.rightContainer} width="95%" height={290} overflow="auto">
                                <Box className={classes.infoContainer}>
                                    <div>
                                        {winner.line
                                            ? <Typography>{statusDes}</Typography>
                                            : <Typography>{statusDes}</Typography>
                                        }
                                        <Typography>History: </Typography>
                                    </div>
                                </Box>
                                <Box className={classes.turnContainer}>
                                    <div>
                                        <ol>{finalMoves}</ol>
                                    </div>
                                </Box>
                            </Box>)
                        }
                        {roomData.ready && !roomData.ready.hasStart &&
                            (<Box className={classes.rightContainer} width="95%" height={290} overflow="auto">
                                <Box className={classes.readyContainer}>
                                    <div>
                                        <Typography>Player 1: {roomData.ready.isReady1 ? "Ready" : "Not Ready"}</Typography>
                                        <Typography>Player 2: {roomData.ready.isReady2 ? "Ready" : "Not Ready"}</Typography>
                                    </div>
                                </Box>
                                <Box className={classes.buttonContainer}>
                                    <Button fullWidth className={classes.button} variant="contained" color="primary" onClick={() => handleReady()} >
                                        Ready
                                </Button>
                                </Box>
                            </Box>)
                        }
                    </Grid>
                </Grid>
            </Box>

        );
    }
}
export default Game;
