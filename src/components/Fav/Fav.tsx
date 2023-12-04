/* eslint-disable no-shadow */
import React from 'react';

import { useNoxSetting } from '@APM/stores/useApp';
import useFav from '@hooks/useFavPaginated';
import { skinPreset } from '../../styles/skin';
import Menu from './Favmenu';
import SongList from './SongList';
import FavHeader from './FavHeader';

const { colorTheme } = skinPreset;

export default function Fav() {
  const playlist = useNoxSetting((state) => state.currentPlaylist);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!playlist) return <></>;

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
    searchBarRef,
  } = useFav(playlist);

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
