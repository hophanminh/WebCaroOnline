import React from 'react';

import './Input.css';
import {green} from "@material-ui/core/colors";
import SendIcon from '@material-ui/icons/Send';

export const Input = ({ message }) => (
    <form className="form">
        <input
            readOnly
            className="input"
            type="text"
            placeholder="Game has end"
            value={message}
        />
    </form>
);