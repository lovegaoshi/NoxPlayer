import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import useApp from '@stores/useApp';
import { useNoxSetting } from '@APM/stores/useApp';

export default function favoriteSongButton({ song }: { song: NoxMedia.Song }) {
  const [liked, setLiked] = useState(false);
  const favoritePlaylist = useNoxSetting((state) => state.favoritePlaylist);
  const setFavoritePlaylist = useNoxSetting(
    (state) => state.setFavoritePlaylist,
  );
  const { buttonStyle } = useApp((state) => state.playerStyle);

  useEffect(() => {
    setLiked(
      favoritePlaylist.songList.filter((val1) => val1.id === song.id).length >
        0,
    );
  }, [song.id]);

  const handleClick = async () => {
    let newSongList = favoritePlaylist.songList;
    if (liked) {
      newSongList = newSongList.filter((val) => val.id !== song.id);
    } else {
      newSongList = [song, ...newSongList];
    }
    setFavoritePlaylist({ ...favoritePlaylist, songList: newSongList });
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
