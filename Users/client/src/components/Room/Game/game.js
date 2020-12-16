import React, { useState, useEffect } from "react";
import './game.css';
import Board from './board.js';
import {
    Box,
    Grid,
    CircularProgress
} from '@material-ui/core';
import socket from "../../../utils/socket.service";
import store from "../../../utils/store.service";



function Game(props) {
    // change these to change the size of the board
    const squareSize = 25;
    const column = 50;
    const row = 50;
    const gameData = props.gameData;
    const roomData = props.roomData;

    const [history, setHistory] = useState();
    const [stepNumber, setStepNumber] = useState();
    const [xIsNext, setXIsNext] = useState();

    useEffect(() => {
        if (gameData) {
            setHistory(gameData.history);
            setStepNumber(gameData.stepNumber);
            setXIsNext(gameData.xIsNext);
        }

    }, [gameData]);




    const handleClick = (move) => {
        const user = store.getState();
        socket.emit("play", { move: move, userID: user.ID, boardID: props.roomID, turn: stepNumber + 1 });
    }
    /*
    const handleClick = (i, previous) => {
        const newHistory = history.slice(0, stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();

        // check if game is finished
        const checkFinish = calculateWinner(squares, stepNumber, previous);
        if (checkFinish.status !== 0 || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';

        setHistory(
            newHistory.concat([{
                squares: squares,
                move: i,
            }])
        );
        setStepNumber(newHistory.length);
        setXIsNext(!xIsNext);
    }
    */

    /*     
    //undo
    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }
    */

    if (!history || !roomData) {
        return (<CircularProgress />)
    }
    else {
        const current = history[stepNumber];
        const moves = history.map((turn, i) => {
            const x = Math.floor(turn.move / column);
            const y = turn.move % column;

            const player = (i % 2) === 0 ? "O" : "X";

            const desc = i ?
                'Turn ' + i + ': (' + x + ',' + y + ') - ' + player :
                'Game start';
            /*
            // undo
            return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>
                        {current === turn ? <b>{desc}</b> : <>{desc}</>}
                    </button>
                </li>
            );
            */
            return (
                <li key={i}>
                    {current === turn ? <b>{desc}</b> : <>{desc}</>}
                </li>
            );
        });

        let statusDes;
        const finalMoves = moves.slice().reverse();
        if (roomData.winner === -1) {
            statusDes = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
        else if (roomData.winner === 0) {
            statusDes = 'Draw';
        }
        else {
            const winner = (roomData.winner === 1) ? 'X' : 'O';
            statusDes = 'Winner: ' + winner;
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
                                    onClick={(i) => handleClick(i)}
                                    winnerLine={gameData.winningLine}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box width="95%" height={290} overflow="auto">
                            {(roomData.idUser1 && roomData.idUser2)
                                ? <div>
                                    <div>
                                        {gameData.winningLine
                                            ? <b>{statusDes}</b>
                                            : <>{statusDes}</>
                                        }
                                    </div>
                                    <div>History: </div>
                                    <ol>{finalMoves}</ol>
                                </div>
                                : <div>Waiting for both players</div>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        );
    }
}
export default Game;
