import React from 'react';

import { filterUndefined } from '@utils/Utils';
import ThumbsUpButton from '../buttons/ThumbsUpButton';
import FavoriteButton from '../buttons/FavoriteSongButton';

const ExtendsContent = (song: NoxMedia.Song) => {
  return song === undefined
    ? // eslint-disable-next-line react/jsx-no-useless-fragment
      [<></>]
    : filterUndefined(
        [
          <ThumbsUpButton song={song} key='song-thumbup-btn' />,
          <FavoriteButton song={song} key='song-fav-btn' />,
        ],
        (v) => v,
      );
};

export default ExtendsContent;
