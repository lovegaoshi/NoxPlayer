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

export default ({ song }) => {

    const [liked, setLiked] = useState(false);
    
    useEffect(() => {
        readLocalStorage(FAV_FAV_LIST_KEY).then(val => {
            setLiked(val.songList.filter(val => val.id === song.id).length > 0);
        });
    }, [song.id])

    const handleClick = async () => {
        let favFavList = await readLocalStorage(FAV_FAV_LIST_KEY);
        if (liked) {
            favFavList.songList = favFavList.songList.filter(val => val.id !== song.id);
        } else {
            favFavList.songList.push(song);
        }
        console.log(favFavList);
        setLocalStorage(FAV_FAV_LIST_KEY, favFavList);
        setLiked(!liked);
    }

    return (
        liked 
        ? 
        <React.Fragment >
            <span
                className="group audio-download"
                css={buttonStyle}
                onClick={() => handleClick(false)}
                title={"不喜欢了"}
                key={uuidv4()}
            >
                <FavoriteIcon />
            </span>
        </React.Fragment>
        : 
        <React.Fragment >
            <span
                className="group audio-download"
                css={buttonStyle}
                onClick={() => handleClick(true)}
                title={"特别喜欢！"}
                key={uuidv4()}
            >
                <FavoriteBorderIcon />
            </span>
        </React.Fragment>
    )
}