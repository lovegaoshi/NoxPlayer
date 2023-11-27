import React, { useState, useEffect } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { skins } from '@styles/skin';
import {
  setLocalStorage,
  readLocalStorage,
  PlayListDict,
} from '@utils/ChromeStorage';
import { FAV_FAV_LIST_KEY } from '@objects/Storage';

const buttonStyle = css`
  cursor: pointer;
  &:hover {
    color: ${skins().reactJKPlayerTheme.sliderColor};
  }
  background-color: transparent;
  color: ${skins().desktopTheme === 'light' ? '7d7d7d' : 'white'};
`;

export default function favoriteSongButton({ song }: { song: NoxMedia.Song }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    readLocalStorage(FAV_FAV_LIST_KEY).then((val: PlayListDict) => {
      setLiked(val.songList.filter((val1) => val1.id === song.id).length > 0);
    });
  }, [song.id]);

  const handleClick = async () => {
    const favFavList = (await readLocalStorage(
      FAV_FAV_LIST_KEY,
    )) as PlayListDict;
    if (liked) {
      favFavList.songList = favFavList.songList.filter(
        (val) => val.id !== song.id,
      );
    } else {
      favFavList.songList.push(song);
    }
    setLocalStorage(FAV_FAV_LIST_KEY, favFavList);
    setLiked(!liked);
  };

  return (
    <React.Fragment>
      <span
        className='group audio-download'
        // eslint-disable-next-line react/no-unknown-property
        css={buttonStyle}
        onClick={() => handleClick()}
        title={liked ? '不喜欢了' : '特别喜欢！'}
        role='button'
        tabIndex={0}
      >
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </span>
    </React.Fragment>
  );
}
