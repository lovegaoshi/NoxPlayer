import React, { useState, useEffect } from "react";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { skins } from '../../styles/skin';
import { v4 as uuidv4 } from 'uuid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { setLocalStorage, readLocalStorage, FAV_FAV_LIST_KEY } from '../../objects/Storage';


const buttonStyle = css`
    cursor: pointer;
    &:hover {
        color: ${skins().reactJKPlayerTheme.sliderColor};
    };
    background-color: transparent;
    color: ${skins().desktopTheme === "light"? "7d7d7d" : "white"};
`

export default ({ handleClick, filled = false }) => {

    if (filled) {
        return (
            <span
                className="group audio-download"
                css={buttonStyle}
                onClick={() => handleClick(false)}
                title={"不喜欢了"}
                key={uuidv4()}
            >
                <FavoriteIcon />
            </span>
        )
    } else {
        return (
            <span
                className="group audio-download"
                css={buttonStyle}
                onClick={() => handleClick(true)}
                title={"特别喜欢！"}
                key={uuidv4()}
            >
                <FavoriteBorderIcon />
            </span>
        )
    }
}