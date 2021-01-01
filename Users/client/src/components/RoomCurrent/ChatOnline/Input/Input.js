import React from 'react';

import './Input.css';
import { green } from "@material-ui/core/colors";
import SendIcon from '@material-ui/icons/Send';

export const Input = ({ message, status, setMessage, sendMessage }) => (
    <form className="form">
        {status === -1
            ? <React.Fragment>
                <input
                    className="input"
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
                />
                <button className="sendButton" onClick={(e) => sendMessage(e)}>
                    <SendIcon
                        fontSize="small"
                        style={{ color: green[500] }}
                    />
                </button>
            </React.Fragment>
            : <input
                readOnly
                className="input"
                type="text"
                placeholder="Game has end"
                value={message}
            />
        }
    </form>
);