import React, { useState, useEffect } from "react";
import queryString from 'query-string';

import {InfoBar} from '../InforBar/InforBar';
import {Input} from '../Input/Input';
import {Messages} from '../Messages/Messages';
import {TextContainer} from '../TextContainter/TextContainer'
import socket from "../../../utils/socket.service";
import HostURL from "../../../utils/host.service";
import './Chat.css';

export const Chat = ({ location }) => {
    const [nameR, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log(window.location.href);
        console.log(window.location.href.search);
        const { name , room } = queryString.parse(window.location.href);
        console.log(room);
        console.log(name);

        setRoom(room);
        setName(name)

        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error);
            }
        });
    }, [HostURL, window.location.href.search]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(msgs => [ ...msgs, message ]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
        <div className="outerContainer">
            <TextContainer users={users} />
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={nameR} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    );
}
