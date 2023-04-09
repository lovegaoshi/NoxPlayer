import React, { useState, useEffect } from "react";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { goToBiliBili, BiliBiliIconSVG } from "../bilibiliIcon";
import { checkBVLiked, sendBVLike } from '../../utils/BiliOperate';
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { skins } from '../../styles/skin';

const buttonStyle = css`
    cursor: pointer;
    &:hover {
        color: ${skins().reactJKPlayerTheme.sliderColor};
    };
    background-color: transparent;
    color: ${skins().desktopTheme === "light"? "7d7d7d" : "white"};
`

export default ({ song }) => {

    const [liked, setLiked] = useState(0);

    useEffect(() => checkBVLiked(song.bvid, setLiked), [song.id]);

    const onClick = () => {
        switch (liked) {
            case 0:
                sendBVLike(song.bvid, () => setLiked(1));
                break;
            case 1:
            case undefined:
                goToBiliBili({ bvid: song.bvid, episode: song.page });
                break;
        }
    }

    return (
        <React.Fragment >
            <span
                className="group audio-download"
                css={buttonStyle}
                onClick={onClick}
                title={
                    liked === 1 ? "已点赞" 
                    : liked === 0 ? "点赞"
                    : "前往视频"
                }
            >         
                    {
                        liked === 1 ? <ThumbUpAltIcon />
                        : liked === 0? <ThumbUpOffAltIcon />
                        : <BiliBiliIconSVG/>
                    }
            </span>
        </React.Fragment >
    )
}