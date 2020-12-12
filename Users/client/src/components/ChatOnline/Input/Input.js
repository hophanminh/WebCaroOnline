import React from 'react';

import './Input.css';
import {green} from "@material-ui/core/colors";
import SendIcon from '@material-ui/icons/Send';

export const Input = ({ message, setMessage, sendMessage }) => (
    <form className="form">
        <input
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null }
        />
        <button className="sendButton" onClick={(e) => sendMessage(e)}>
            <div>
                <SendIcon
                    fontSize="small"
                    style={{ color: green[500] }}
                />
            </div>
        </button>
    </form>
);