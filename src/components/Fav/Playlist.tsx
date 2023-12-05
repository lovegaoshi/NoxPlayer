/* eslint-disable no-shadow */
import React from 'react';

import { useNoxSetting } from '@APM/stores/useApp';
import useFav from './hooks/usePlaylistPaginated';
import { skinPreset } from '../../styles/skin';
import Menu from './SongMenu';
import SongList from './SongList/SongList';
import FavHeader from './PlaylistHeader/PlaylistHeader';

const { colorTheme } = skinPreset;

export default function Fav() {
  const playlist = useNoxSetting((state) => state.currentPlaylist);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!playlist) return <></>;
  const usedFav = useFav(playlist);

  return (
    <React.Fragment>
      <Menu theme={colorTheme.generalTheme} />
      <FavHeader playlist={playlist} useFav={usedFav} />
      <SongList playlist={playlist} useFav={usedFav} />
    </React.Fragment>
  );
}
