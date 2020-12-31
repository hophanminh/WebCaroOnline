import React from 'react';

import Square from './square.js';

function Board(props) {
  const renderSquare = (i, color) => {
    // check if need to to color
    const style = color ? { color: 'red' } : {};

    return (
      <Square
        key={i}
        style={style}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }

  const winnerLine = props.winnerLine;
  let count = 0;
  const board = [];
  let color = false;

  // create
  for (var i = 0; i < props.row; i++) {
    var row = [];
    for (var j = 0; j < props.column; j++) {
      // check color
      if (winnerLine && winnerLine.includes(count)) {
        color = true;
      }
      else {
        color = false;
      }
      // add square to row
      row.push(renderSquare(count, color));
      count++;
    }
    board.push(<div key={i} className="board-row">{row}</div>);
  }
  return board;

}

export default Board;
