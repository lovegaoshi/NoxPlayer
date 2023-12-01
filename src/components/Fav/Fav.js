/* eslint-disable no-shadow */
import React, { useEffect, useState, useRef } from 'react';
import { styled, createTheme } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { zhCN } from '@mui/material/locale';

import { useNoxSetting } from '@APM/stores/useApp';
import useFav from '@hooks/useFav';
import { skinPreset } from '../../styles/skin';
import RandomGIFIcon from '../buttons/RandomGIF';
import { readLocalStorage } from '../../utils/ChromeStorage';
import FavSettingsButtons from './FavSetting/FavSettingsButton';
import SongSearchBar from '../dialogs/SongSearchbar';
import Menu from './Favmenu';

import SongList from './SongList';

const { colorTheme } = skinPreset;

export const Fav = function Fav({
  FavList,
  rssUpdate,
  handleAddToFavClick,
  handleDeleteFromSearchList,
}) {
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

  const { rows, setRows, handleSearch } = useFav(FavList);

  /**
   * because of delayed state update/management, we need a reliable way to get
   * the current playlist songs (which may be filtered by some search string).
   * this method returns the accurate current playlist's songs.
   * @returns rows when FavList is the same as the Favlist props; or Favlist.songlist
   */
  const getCurrentRow = () => {
    if (FavList !== null && rows !== null) {
      return rows;
    }
    return FavList.songList;
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
          if (songList[i].id === r.cid) {
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
  }, [FavList.id]);

  /**
   * forcefully search a string in the playlist.
   * setting the searchbar ref's value directly is bugged with
   * the visual update of textfield's label; otherwise works just fine.
   * @param {string} searchedVal
   */
  const performSearch = (searchedVal) => {
    setTimeout(() => {
      searchBarRef.current.value = searchedVal;
    }, 100);
    handleSearch(searchedVal);
  };

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!FavList) return <></>;

  return (
    <React.Fragment>
      <Menu theme={colorTheme.generalTheme} />
      <Box
        sx={{ flexGrow: 1, maxHeight: '80px' }}
        style={{ paddingBottom: '8px' }}
      >
        <Grid container spacing={2} style={{ padding: '10px' }}>
          <Grid
            item
            xs={5}
            style={{
              textAlign: 'left',
              padding: '0px',
              paddingLeft: '12px',
              paddingTop: '12px',
            }}
            overflow='hidden'
          >
            <Typography
              variant='h6'
              style={{
                color: colorTheme.playlistCaptionColor,
                whiteSpace: 'nowrap',
                fontSize: '2rem',
              }}
            >
              {FavList.title}
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'center', padding: '0px' }}>
            <RandomGIFIcon
              gifs={skinPreset.gifs}
              favList={FavList.id + page.toString()}
              onClickCallback={primePageToCurrentPlaying}
            />
          </Grid>
          <Grid item xs={5} style={{ textAlign: 'right', padding: '10px' }}>
            {!FavList.id.includes('Special') && (
              <FavSettingsButtons
                currentList={FavList}
                rssUpdate={async (subscribeUrls) => {
                  const val = await rssUpdate(subscribeUrls);
                  if (val !== null) setRows(val.songList);
                }}
              />
            )}
            <SongSearchBar handleSearch={handleSearch} ref={searchBarRef} />
          </Grid>
        </Grid>
      </Box>
      <SongList
        playlist={FavList}
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
};

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  zhCN,
);

export const songText = {
  fontSize: 16,
  minWidth: 0,
  overflow: 'hidden',
  paddingBottom: '4px',
  paddingTop: '4px',
};

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: colorTheme.FavAlternateBackgroundColor, // theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    padding: 0,
  },
}));
