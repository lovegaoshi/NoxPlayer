import React, { useState, useEffect } from 'react';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
// @ts-expect-error
import ClickNHold from 'react-click-n-hold';

import {
  checkBVLiked,
  sendBVLike,
  sendBVTriple,
} from '@utils/Bilibili/BiliOperate';
import useApp from '@stores/useApp';
import { goToBiliBili, BiliBiliIconSVG } from '../bilibiliIcon';

interface HoldProps {
  song: NoxMedia.Song;
  setLiked: React.Dispatch<React.SetStateAction<number>>;
}
function ThumbsUpClickNHold({ song, setLiked }: HoldProps) {
  const start = () => {};
  const clickNHold = () => sendBVTriple(song.bvid, () => setLiked(1));
  const end = (_e: any, enough: any) => {
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

interface Props {
  song: NoxMedia.Song;
}
export default function ThumbsUpButton({ song }: Props) {
  const [liked, setLiked] = useState(0);
  const { buttonStyle } = useApp((state) => state.playerStyle);

  useEffect(() => checkBVLiked(song.bvid, setLiked), [song.id]);

  const onClick = () => {
    switch (liked) {
      case 0:
        sendBVLike(song.bvid, () => setLiked(1));
        break;
      case 1:
      default:
        goToBiliBili(song);
        break;
    }
  };

  return (
    <span
      className='group audio-download'
      // @ts-expect-error
      // eslint-disable-next-line react/no-unknown-property
      css={buttonStyle}
      title={liked === 1 ? '已点赞' : liked === 0 ? '点赞' : '前往视频'}
      role='button'
      tabIndex={0}
    >
      {liked === 1 ? (
        <ThumbUpAltIcon onClick={onClick} />
      ) : liked === 0 ? (
        <ThumbsUpClickNHold song={song} setLiked={setLiked} />
      ) : (
        <BiliBiliIconSVG onClick={onClick} />
      )}
    </span>
  );
}
