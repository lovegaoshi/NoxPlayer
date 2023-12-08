/* eslint-disable no-shadow */
import React from 'react';

import { useNoxSetting } from '@APM/stores/useApp';
import usePlaylistPaginated from './hooks/usePlaylistPaginated';
import { skinPreset } from '../../styles/skin';
import Menu from './SongMenu';
import SongList from './SongList/SongList';
import PlaylistHeader from './PlaylistHeader/PlaylistHeader';

const { colorTheme } = skinPreset;

export default function Fav() {
  const playlist = useNoxSetting((state) => state.currentPlaylist);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!playlist) return <></>;
  const playlistPaginated = usePlaylistPaginated(playlist);

  return (
    <React.Fragment>
      <Menu theme={colorTheme.generalTheme} />
      <PlaylistHeader
        playlist={playlist}
        playlistPaginated={playlistPaginated}
      />
      <SongList playlist={playlist} playlistPaginated={playlistPaginated} />
    </React.Fragment>
  );
}
