/* eslint-disable no-shadow */
import React, { useEffect, useState, useRef } from 'react';

import { useNoxSetting } from '@APM/stores/useApp';
import useFav from '@hooks/useFav';
import { skinPreset } from '../../styles/skin';
import { readLocalStorage } from '../../utils/ChromeStorage';
import Menu from './Favmenu';

import SongList from './SongList';
import FavHeader from './FavHeader';

const { colorTheme } = skinPreset;

interface Props {
  playlist?: NoxMedia.Playlist;
  rssUpdate: (v: string[]) => Promise<NoxMedia.Playlist>;
  handleAddToFavClick: (v: NoxMedia.Playlist) => void;
  handleDeleteFromSearchList: (i: string, j: string) => Promise<void>;
}
export default function Fav({
  playlist,
  rssUpdate,
  handleAddToFavClick,
  handleDeleteFromSearchList,
}: Props) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!playlist) return <></>;

  const playlistShouldReRender = useNoxSetting(
    (state) => state.playlistShouldReRender,
  );

  const [page, setPage] = useState(0);
  const defaultRowsPerPage = Math.max(
    1,
    Math.floor((window.innerHeight - 305) / 40),
  );
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const searchBarRef = useRef();

  const { rows, setRows, handleSearch } = useFav(playlist);

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
  const primePageToCurrentPlaying = () => {
    try {
      const songList = getCurrentRow();
      readLocalStorage('CurrentPlaying').then((r) => {
        for (let i = 0, n = songList.length; i < n; i++) {
          if (songList[i]!.id === r.cid) {
            setPage(Math.floor(i / defaultRowsPerPage));
            break;
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setRowsPerPage(defaultRowsPerPage);
    primePageToCurrentPlaying();
    performSearch('');
  }, [playlist.id]);

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
        handleDeleteFromSearchList={handleDeleteFromSearchList}
        handleAddToFavClick={handleAddToFavClick}
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
