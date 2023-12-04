/* eslint-disable no-shadow */
import React, { useEffect, useRef } from 'react';

import { useNoxSetting } from '@APM/stores/useApp';
import useFav from '@hooks/useFavPaginated';
import { skinPreset } from '../../styles/skin';
import Menu from './Favmenu';
import SongList from './SongList';
import FavHeader from './FavHeader';

const { colorTheme } = skinPreset;

export default function Fav() {
  const playlist = useNoxSetting((state) => state.currentPlaylist);
  const playlistShouldReRender = useNoxSetting(
    (state) => state.playlistShouldReRender,
  );
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!playlist) return <></>;

  const searchBarRef = useRef();

  const {
    rows,
    setRows,
    handleSearch,
    rssUpdate,
    page,
    setPage,
    defaultRowsPerPage,
    rowsPerPage,
    setRowsPerPage,
    primePageToCurrentPlaying,
  } = useFav(playlist);

  useEffect(() => {
    setRowsPerPage(defaultRowsPerPage);
    performSearch('');
    primePageToCurrentPlaying(true, playlist.songList);
  }, [playlist.id, playlistShouldReRender]);

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

  return (
    <React.Fragment>
      <Menu theme={colorTheme.generalTheme} />
      <FavHeader
        playlist={playlist}
        rssUpdate={rssUpdate}
        page={page}
        primePageToCurrentPlaying={primePageToCurrentPlaying}
        handleSearch={handleSearch}
        searchBarRef={searchBarRef}
        setRows={setRows}
      />
      <SongList
        playlist={playlist}
        rssUpdate={rssUpdate}
        rows={rows}
        handleSearch={handleSearch}
        page={page}
        setPage={setPage}
        defaultRowsPerPage={defaultRowsPerPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        searchBarRef={searchBarRef}
      />
    </React.Fragment>
  );
}
