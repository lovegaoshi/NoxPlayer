import React, { useState } from 'react';

import { useNoxSetting } from '@APM/stores/useApp';
import useFav from './useFav';
/**
 * use hook for the paginated fav view. has rows.
 * @param playlist
 * @returns
 */
const useFavP = (playlist: NoxMedia.Playlist) => {
  const usedFav = useFav(playlist);
  const { rows, setRows, handleSearch, rssUpdate, saveCurrentList } = usedFav;
  const currentPlayingId = useNoxSetting((state) => state.currentPlayingId);
  const [page, setPage] = useState(0);
  const defaultRowsPerPage = Math.max(
    1,
    Math.floor((window.innerHeight - 305) / 40),
  );
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  /**
   * because of delayed state update/management, we need a reliable way to get
   * the current playlist songs (which may be filtered by some search string).
   * this method returns the accurate current playlist's songs.
   * @returns rows when playlist is the same as the playlist props; or playlist.songlist
   */
  const getCurrentRow = () => {
    if (playlist !== null && rows !== null) {
      return rows;
    }
    return playlist.songList;
  };

  /**
   * this method primes the current page displaying songs to the one containing the song
   * that is currently in play. the current song is found by reading the locally stored
   * value "currentPlaying". this function is in a useEffect.
   */
  const primePageToCurrentPlaying = (
    resetToFirstPage = false,
    songList = getCurrentRow(),
  ) => {
    for (let i = 0, n = songList.length; i < n; i++) {
      if (songList[i]!.id === currentPlayingId) {
        return setPage(Math.floor(i / defaultRowsPerPage));
      }
    }
    if (resetToFirstPage) setPage(0);
  };
  return {
    ...usedFav,
    page,
    setPage,
    defaultRowsPerPage,
    rowsPerPage,
    setRowsPerPage,
    primePageToCurrentPlaying,
  };
};

export default useFavP;
