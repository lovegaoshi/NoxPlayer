import React, { useState } from 'react';

import { reParseSearch } from '@APM/utils/re';
import { useNoxSetting } from '@APM/stores/useApp';
import usePlaylist from './usePlaylist';

/**
 * use hook for the paginated fav view. has rows.
 * @param playlist
 * @returns
 */
const useFav = (playlist: NoxMedia.Playlist) => {
  const [rows, setRows] = useState<NoxMedia.Song[]>([]);
  const updatePlaylist = useNoxSetting((state) => state.updatePlaylist);
  const { updateSubscribeFavList } = usePlaylist();
  const saveCurrentList = () => updatePlaylist(playlist);

  const handleSearch = (searchedVal: string) => {
    if (searchedVal === '') {
      setRows(playlist.songList);
      return;
    }
    setRows(reParseSearch({ searchStr: searchedVal, rows: playlist.songList }));
  };

  const rssUpdate = (subscribeUrls: string[]) =>
    updateSubscribeFavList({
      playlist,
      subscribeUrls,
    });

  return {
    rows,
    setRows,
    handleSearch,
    rssUpdate,
    saveCurrentList,
  };
};

export default useFav;
