import React from 'react';

import { useNoxSetting } from '@APM/stores/useApp';
import useApp from '@stores/useApp';
import usePlaylistPaginated from './hooks/usePlaylistPaginated';
import Menu from './SongMenu';
import SongList from './SongList/SongList';
import PlaylistHeader from './PlaylistHeader/PlaylistHeader';

export default function Fav() {
  const playlist = useNoxSetting((state) => state.currentPlaylist);
  const { colorTheme } = useApp((state) => state.playerStyle);
  const playlistPaginated = usePlaylistPaginated(playlist);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!playlist) return <></>;

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
