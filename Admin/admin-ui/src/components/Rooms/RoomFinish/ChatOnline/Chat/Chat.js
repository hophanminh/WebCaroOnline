import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent
} from '@material-ui/core';

import { InfoBar } from '../InforBar/InforBar';
import { Input } from '../Input/Input';
import { Messages } from '../Messages/Messages';
import { TextContainer } from '../TextContainter/TextContainer'
import socket from "../../../../../utils/socket.service";
import DataService from "../../../../../utils/data.service";
import './Chat.css';

export const Chat = (props) => {
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await DataService.getMessage(props.room);
                setMessages(res.data);
            }
            catch (error) {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                alert(resMessage);
            }
        }
        fetchData();

    }, []);

    return (
        <Card className="outerContainer">
            {true ? <></> :
                <TextContainer users={users} />}
            <div className="container">
                <InfoBar room={props.room} />
                {props.name
                    ? <>
                        <Messages messages={messages} name={props.name} />
                        <Input message={message} />
                    </>
                    : <CardContent className="notLogin">Login to see chat</CardContent>
                }
            </div>
        </Card>
    );
}
