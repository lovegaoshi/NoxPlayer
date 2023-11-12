import React, { useState, useEffect } from 'react';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { jsx, css } from '@emotion/react';
import ClickNHold from 'react-click-n-hold';

import { checkBVLiked, sendBVLike, sendBVTriple } from '@utils/BiliOperate';
/** @jsx jsx */
import { skins } from '@styles/skin';
import { goToBiliBili, BiliBiliIconSVG } from '../bilibiliIcon';

export default function thumbsUpButton({ song }) {
  const [liked, setLiked] = useState(0);

  useEffect(() => checkBVLiked(song.bvid, setLiked), [song.id]);

  const onClick = () => {
    switch (liked) {
      case 0:
        sendBVLike(song.bvid, () => setLiked(1));
        break;
      case 1:
      default:
        goToBiliBili({ bvid: song.bvid, episode: song.page });
        break;
    }
  };

  function ThumbsUpClickNHold() {
    const start = () => {};
    const clickNHold = () => sendBVTriple(song.bvid, () => setLiked(1));
    const end = (e, enough) => {
      if (enough) return;
      sendBVLike(song.bvid, () => setLiked(1));
    };

    return (
      <ClickNHold
        time={2} // Time to keep pressing. Default is 2
        onStart={start} // Start callback
        onClickNHold={clickNHold} // Timeout callback
        onEnd={end}
      >
        <ThumbUpOffAltIcon />
      </ClickNHold>
    );
  }

  return (
    <React.Fragment>
      <span
        className='group audio-download'
        // eslint-disable-next-line react/no-unknown-property
        css={buttonStyle}
        title={liked === 1 ? '已点赞' : liked === 0 ? '点赞' : '前往视频'}
        role='button'
        tabIndex={0}
      >
        {liked === 1 ? (
          <ThumbUpAltIcon onClick={onClick} />
        ) : liked === 0 ? (
          <ThumbsUpClickNHold />
        ) : (
          <BiliBiliIconSVG onClick={onClick} />
        )}
      </span>
    </React.Fragment>
  );
}

const buttonStyle = css`
  cursor: pointer;
  &:hover {
    color: ${skins().reactJKPlayerTheme.sliderColor};
  }
  background-color: transparent;
  color: ${skins().desktopTheme === 'light' ? '7d7d7d' : 'white'};
`;
