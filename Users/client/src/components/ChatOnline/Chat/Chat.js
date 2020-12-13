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
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        setRoom(params.get('room'));
        setName(params.get('name'))

        socket.emit('join', { name: params.get('name'), room: params.get('room') }, (error) => {
            if(error) {
                alert(error);
            }
        });
    }, [HostURL, window.location.href]);

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
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    );
}
