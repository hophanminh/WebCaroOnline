import React from 'react';

function Square(props) {
    return (
        <button className="square" style={props.style}>
        {props.value}
        </button>
    );
}

export default Square;
