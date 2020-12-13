import React, { useState } from 'react';
import '../../../css/game.css'
import Board from './board.js';
import {
    Box,
    Grid,
} from '@material-ui/core';



function Game(props) {
    // change these to change the size of the board
    const squareSize = 25;
    const column = 50;
    const row = 50;
    const win = 5;

    const [history, setHistory] = useState(
        [{
            squares: Array(column * row).fill(null),
            move: -1,
        }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);

    const calculateWinner = (squares, stepNumber, move) => {
        //  illegal move
        if (move === -1) {
            return ({
                line: null,
                status: 0,
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
                status: -1,
            })
        }

        // game continues
        return ({
            line: null,
            status: 0,
        })
    }


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

    /*     
    //undo
    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }
    */

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares, stepNumber, current.move);

    const moves = history.map((turn, i) => {
        const x = Math.floor(turn.move / column);
        const y = turn.move % column;

        const player = (i % 2) === 0 ? "O" : "X";

        const desc = i ?
            'Turn ' + i + ': (' + x + ',' + y + ') - ' + player:
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
    if (winner.status === 0) {
        statusDes = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    else if (winner.status === -1) {
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
                    <Box width="95%" height={290} overflow="auto">
                        <div>
                            <div>{statusDes}</div>
                            <div>History: </div>
                            <ol>{finalMoves}</ol>
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </Box>

    );
}
export default Game;
