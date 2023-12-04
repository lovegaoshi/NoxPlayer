import React, { useState, useRef } from 'react';

import { reParseSearch } from '@APM/utils/re';
import { useNoxSetting } from '@APM/stores/useApp';
import usePlaylist from '@hooks/usePlaylist';

export interface UseFav {
  rows: NoxMedia.Song[];
  performSearch: (searchedVal: string) => void;
  setRows: (v: NoxMedia.Song[]) => void;
  handleSearch: (searchedVal: string) => void;
  rssUpdate: (subscribeUrls: string[]) => Promise<NoxMedia.Playlist>;
  saveCurrentList: () => void;
  searchBarRef: React.MutableRefObject<any>;
}

/**
 * use hook for the paginated fav view. has rows.
 * @param playlist
 * @returns
 */
const useFav = (playlist: NoxMedia.Playlist): UseFav => {
  const [rows, setRows] = useState<NoxMedia.Song[]>([]);
  const updatePlaylist = useNoxSetting((state) => state.updatePlaylist);
  const { updateSubscribeFavList } = usePlaylist();
  const saveCurrentList = () => updatePlaylist(playlist);
  const searchBarRef = useRef();

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

  /**
   * forcefully search a string in the playlist.
   * setting the searchbar ref's value directly is bugged with
   * the visual update of textfield's label; otherwise works just fine.
   * @param {string} searchedVal
   */
  const performSearch = (searchedVal: string) => {
    setTimeout(() => {
      if (searchBarRef.current) {
        // TODO: fix type
        // @ts-ignore
        searchBarRef.current.value = searchedVal;
      }
    }, 100);
    handleSearch(searchedVal);
  };

  return {
    rows,
    setRows,
    handleSearch,
    rssUpdate,
    saveCurrentList,
    searchBarRef,
    performSearch,
  };
};

export default useFav;
