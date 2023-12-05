/* eslint-disable no-shadow */
import React from 'react';
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

import SongRenameDialog from '@components/dialogs/SongRenameDialog';
import { useNoxSetting } from '@APM/stores/useApp';
import usePlaylistCRUD from '@hooks/usePlaylistCRUD';
import usePlayback from '@hooks/usePlayback';
import { skinPreset } from '@styles/skin';
import { ScrollBar } from '@styles/styles';
import { UsePlaylistP } from '../hooks/usePlaylistPaginated';
import useRenameSong from '../hooks/useRenameSong';

import FavTableActions from './SongListTableActions';
import SongInfo from './SongInfo';

const { colorTheme } = skinPreset;

interface Props {
  playlist: NoxMedia.Playlist;
  useFav: UsePlaylistP;
}
export default function Fav({ playlist, useFav }: Props) {
  const {
    rssUpdate,
    rows,
    page,
    defaultRowsPerPage,
    rowsPerPage,
    searchBarRef,
    performSearch,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useFav;
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const playlistCRUD = usePlaylistCRUD();
  const { onPlayOneFromFav } = usePlayback({});
  const {
    songObjEdited,
    songEditDialogOpen,
    openSongEditDialog,
    setSongEditDialogOpen,
  } = useRenameSong();

  const { handleDeleteFromSearchList, handleAddToFavClick, updateSong } =
    playlistCRUD;

  const className = ScrollBar().root;

  const favListReloadBVid = (bvid: string) => {
    playlist.songList = playlist.songList.filter((x) => x.bvid !== bvid);
    rssUpdate([bvid]);
  };

  return (
    <React.Fragment>
      <SongRenameDialog
        openState={songEditDialogOpen}
        song={songObjEdited}
        onClose={() => setSongEditDialogOpen(false)}
        updateSong={updateSong}
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
              <SongInfo
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
