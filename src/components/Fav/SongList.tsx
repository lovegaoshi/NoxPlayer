/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

import { zhCN } from '@mui/material/locale';
import { useHotkeys } from 'react-hotkeys-hook';

import usePlayer from '@hooks/usePlayer';
import { useNoxSetting } from '@APM/stores/useApp';
import { skinPreset } from '../../styles/skin';
import { readLocalStorage } from '../../utils/ChromeStorage';
import SongRenameDialog from '../dialogs/SongRenameDialog';
import { ScrollBar } from '../../styles/styles';

import FavTableActions from './SongListTableActions';
import SongRow from './SongRow';

const { colorTheme } = skinPreset;

interface Props {
  playlist: NoxMedia.Playlist;
  handleAddToFavClick: (p: NoxMedia.Playlist, s: NoxMedia.Song) => void;
  handleDeleteFromSearchList: (i: string, j: string) => Promise<void>;
  rssUpdate: (v: string[]) => Promise<NoxMedia.Playlist>;
  rows: NoxMedia.Song[];
  page: number;
  setPage: (v: number) => void;
  defaultRowsPerPage: number;
  rowsPerPage: number;
  setRowsPerPage: (v: number) => void;
  handleSearch: (v: string) => void;
  searchBarRef: any;
}
export default function Fav({
  playlist,
  handleDeleteFromSearchList,
  handleAddToFavClick,
  rssUpdate,
  rows,
  page,
  setPage,
  defaultRowsPerPage,
  rowsPerPage,
  setRowsPerPage,
  handleSearch,
  searchBarRef,
}: Props) {
  const updatePlaylist = useNoxSetting((state) => state.updatePlaylist);
  const playlistShouldReRender = useNoxSetting(
    (state) => state.playlistShouldReRender,
  );
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const { onPlayOneFromFav } = usePlayer({});

  const [songObjEdited, setSongObjEdited] = useState<NoxMedia.Song>();
  const [songEditDialogOpen, setSongEditDialogOpen] = useState(false);

  useHotkeys('left', () => handleChangePage(null, page - 1));
  useHotkeys('right', () => handleChangePage(null, page + 1));

  const saveCurrentList = () => updatePlaylist(playlist);

  /**
   * because of delayed state update/management, we need a reliable way to get
   * the current playlist songs (which may be filtered by some search string).
   * this method returns the accurate current playlist's songs.
   * @returns rows when playlist is the same as the Favlist props; or Favlist.songlist
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
  }, [playlist.id, playlistShouldReRender]);

  /**
   * forcefully search a string in the playlist.
   * setting the searchbar ref's value directly is bugged with
   * the visual update of textfield's label; otherwise works just fine.
   * @param {string} searchedVal
   */
  const performSearch = (searchedVal: string) => {
    setTimeout(() => {
      searchBarRef.current.value = searchedVal;
    }, 100);
    handleSearch(searchedVal);
  };

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

  const className = ScrollBar().root;

  const favListReloadBVid = (bvid: string) => {
    playlist.songList = playlist.songList.filter((x) => x.bvid !== bvid);
    rssUpdate([bvid]);
  };

  const openSongEditDialog = (song: NoxMedia.Song) => {
    setSongObjEdited(song);
    setSongEditDialogOpen(true);
  };

  return (
    <React.Fragment>
      <SongRenameDialog
        openState={songEditDialogOpen}
        song={songObjEdited}
        onClose={() => setSongEditDialogOpen(false)}
        saveList={saveCurrentList}
      />
      <TableContainer
        className={className}
        id='FavTable'
        component={Paper}
        sx={{ maxHeight: 'calc(100% - 65px)' }}
        style={{
          overflow: 'auto',
          boxShadow: colorTheme.songListShadowStyle,
          backgroundColor: colorTheme.FavBackgroundColor,
        }}
      >
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  // @ts-ignore
                  align={column.align}
                  sx={{
                    width: column.minWidth,
                    padding: column.padding,
                  }}
                  style={{
                    backgroundColor:
                      colorTheme.FavBackgroundColorSolid === undefined
                        ? colorTheme.FavBackgroundColor
                        : colorTheme.FavBackgroundColorSolid,
                    color: colorTheme.songListColumnHeaderColor,
                  }}
                >
                  {column.label}
                  {column.id === 'name' ? `(${rows.length})` : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((song, index) => (
              <SongRow
                key={`${index}`}
                song={song}
                index={index}
                playlist={playlist}
                performSearch={performSearch}
                handleDeleteFromSearchList={handleDeleteFromSearchList}
                favListReloadBVid={favListReloadBVid}
                openSongEditDialog={openSongEditDialog}
                playSong={(v) =>
                  onPlayOneFromFav(v, {
                    ...playlist,
                    songList: playerSetting.keepSearchedSongListWhenPlaying
                      ? rows
                      : playlist.songList,
                  })
                }
                searchBarRef={searchBarRef}
                handleAddToFavClick={handleAddToFavClick}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <ThemeProvider theme={theme}>
                <TablePagination
                  rowsPerPageOptions={[
                    defaultRowsPerPage,
                    99,
                    playlist.songList.length,
                  ]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={FavTableActions}
                  style={{ color: colorTheme.playListIconColor }}
                />
              </ThemeProvider>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  zhCN,
);

const columns = [
  { id: 'name', label: '歌曲名', minWidth: '20%' },
  {
    id: 'uploader',
    label: 'UP主',
    align: 'center',
    padding: '0px',
  },
  {
    id: 'operation',
    label: '操作',
    minWidth: '20%',
    align: 'right',
  },
];
