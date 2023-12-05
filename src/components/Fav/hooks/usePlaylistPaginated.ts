import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useNoxSetting } from '@APM/stores/useApp';
import useFav, { UseFav } from '@APM/hooks/usePlaylist';
import { syncFavlist } from '@utils/Bilibili/bilifavOperate';
import { PLAYLIST_ENUMS } from '@enums/Playlist';
import { logger } from '@utils/Logger';

export interface UseFavP extends UseFav {
  page: number;
  setPage: (page: number) => void;
  defaultRowsPerPage: number;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  primePageToCurrentPlaying: () => void;
  handleChangePage: (event: any, newPage: number) => void;
  handleChangeRowsPerPage: (event: any) => void;
  refreshPlaylist: () => void;
}

/**
 * use hook for the paginated fav view. has rows.
 * @param playlist
 * @returns
 */
const useFavP = (playlist: NoxMedia.Playlist): UseFavP => {
  const usedFav = useFav(playlist);
  const { setRefreshing, rssUpdate, rows, performSearch, setRows } = usedFav;
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const currentPlayingId = useNoxSetting((state) => state.currentPlayingId);
  const playlistShouldReRender = useNoxSetting(
    (state) => state.playlistShouldReRender,
  );
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

  useEffect(() => {
    setRowsPerPage(defaultRowsPerPage);
    performSearch('');
    primePageToCurrentPlaying(true, playlist.songList);
  }, [playlist.id, playlistShouldReRender]);

  useHotkeys('left', () => handleChangePage(null, page - 1));
  useHotkeys('right', () => handleChangePage(null, page + 1));

  const handleChangePage = (event: any, newPage: number) => {
    const maxPage = Math.ceil(rows.length / rowsPerPage);
    if (newPage < 0) newPage = 0;
    else if (newPage >= maxPage) newPage = maxPage - 1;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const refreshPlaylist = async (subscribeUrls?: string[]) => {
    if (playlist.type !== PLAYLIST_ENUMS.TYPE_TYPICA_PLAYLIST) {
      return;
    }
    setRefreshing(true);
    try {
      const val = await rssUpdate(subscribeUrls);
      if (val !== undefined) setRows(val.songList);
    } catch (e) {
      logger.error('[refreshPlaylist] failed');
      logger.error(String(e));
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (
      playerSetting.autoRSSUpdate &&
      playlist.type === PLAYLIST_ENUMS.TYPE_TYPICA_PLAYLIST &&
      playlist.subscribeUrl.length > 0 &&
      playlist.subscribeUrl[0]!.length > 0 &&
      new Date().getTime() - playlist.lastSubscribed > 86400000
    ) {
      refreshPlaylist().then(() => {
        if (playlist.biliSync) {
          syncFavlist(playlist);
        }
      });
    }
  }, [playlist]);

  return {
    ...usedFav,
    page,
    setPage,
    defaultRowsPerPage,
    rowsPerPage,
    setRowsPerPage,
    primePageToCurrentPlaying,
    handleChangePage,
    handleChangeRowsPerPage,
    refreshPlaylist,
  };
};

export default useFavP;
