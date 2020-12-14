import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent
} from '@material-ui/core';

import { InfoBar } from '../InforBar/InforBar';
import { Input } from '../Input/Input';
import { Messages } from '../Messages/Messages';
import { TextContainer } from '../TextContainter/TextContainer'
import socket from "../../../utils/socket.service";
import './Chat.css';

export const Chat = (props) => {
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(msgs => [...msgs, message]);
        });

        socket.on("usersInRoom", ({ users }) => {
            setUsers(users);
        });

        return () => {
            socket.off("message");
            socket.off("usersInRoom");

        }

    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
        <Card className="outerContainer">
            {true ? <></> :
                <TextContainer users={users} />}
            <div className="container">
                <InfoBar room={props.room} />
                {props.name
                    ? <>
                        <Messages messages={messages} name={props.name} />
                        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                    </>
                    : <CardContent className="notLogin">Login to see chat</CardContent>
                }
            </div>
        </Card>
    );
}
