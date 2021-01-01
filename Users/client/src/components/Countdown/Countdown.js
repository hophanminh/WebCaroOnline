import React, { useState, useEffect } from "react";
import {
    makeStyles, ServerStyleSheets,
} from '@material-ui/core';
import config from "../../utils/config.json";
import socket from "../../utils/socket.service";

const useStyles = makeStyles((theme) => ({
    countdown: {
        fontSize: '26px',
    },
    timeout: {
        color: 'red',
    }
}));

export default function Countdown(props) {
    const classes = useStyles();
    const reset = props.reset;
    const counter = props.counter;

    // run countdown
    useEffect(() => {
        let timer;
        if (counter && counter > 0) {
            timer = setTimeout(() => props.setCounter(counter - 1), 1000);
        }
        else {
            //props.timeout();
        }
        return () => clearTimeout(timer);
    }, [counter]);

    // reset countdown
    useEffect(() => {
        if (reset) {
            props.setCounter(config["time-limit"]);
            props.setReset(false);
        }
    }, [reset]);

    return (
        <div className={classes.countdown}>
            {counter !== 0
                ?
                <div className={counter <= 9 ? classes.timeout : null}>
                    {counter}
                </div>
                :
                <div className={classes.timeout}>Timeout</div>
            }
        </div>
    );
}
