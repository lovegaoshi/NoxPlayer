import React, { useState } from 'react';

import { reParseSearch } from '@APM/utils/re';
import usePlaylist from './usePlaylist';

const useFav = (playlist: NoxMedia.Playlist) => {
  const [rows, setRows] = useState<NoxMedia.Song[]>([]);
  const { updateSubscribeFavList } = usePlaylist();

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
  };
};

export default useFav;
