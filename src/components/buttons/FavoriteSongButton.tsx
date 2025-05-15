import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import useApp from '@stores/useApp';
import { getFavContainSong } from '@APM/utils/db/sqlStorage';

export default function FavoriteSongButton({ song }: { song: NoxMedia.Song }) {
  const [liked, setLiked] = useState(false);
  const { buttonStyle } = useApp((state) => state.playerStyle);

  useEffect(() => {
    getFavContainSong({ song }).then(setLiked);
  }, [song.id]);

  const handleClick = async () => {
    getFavContainSong({ song, add: !liked, remove: liked });
    setLiked(!liked);
  };

  return (
    // HACK: how to fix this?
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <span
      className='group audio-download'
      // @ts-expect-error
      // eslint-disable-next-line react/no-unknown-property
      css={buttonStyle}
      onClick={() => handleClick()}
      title={liked ? '不喜欢了' : '特别喜欢！'}
      role='button'
      tabIndex={0}
    >
      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </span>
  );
}
