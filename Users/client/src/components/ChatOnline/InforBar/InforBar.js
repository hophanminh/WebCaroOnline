import React from 'react';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import CloseIcon from '@material-ui/icons/Close';
import { green, red } from '@material-ui/core/colors';

import './InforBar.css';

export const InfoBar = ({ room }) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            <Brightness1Icon
                fontSize="small"
                style={{ color: green[500] }}
            />
            <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
            <a href="/">
                <CloseIcon
                    fontSize="small"
                    style={{ color: red[500] }}
                />
            </a>
        </div>
    </div>
);