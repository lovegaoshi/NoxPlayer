/* eslint-disable no-shadow */
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

import { zhCN } from '@mui/material/locale';

import SongRenameDialog from '@components/dialogs/SongRenameDialog';
import { AddFavDialog } from '@components/dialogs/AddFavDialog';
import { useNoxSetting } from '@APM/stores/useApp';
import usePlaylistCRUD from '@hooks/usePlaylistCRUD';
import usePlayback from '@hooks/usePlayback';
import useApp from '@stores/useApp';
import { UsePlaylistP } from '../hooks/usePlaylistPaginated';
import useRenameSong from '../hooks/useRenameSong';

import FavTableActions from './SongListTableActions';
import SongInfo from './SongInfo';
import { SongListDraggable, SongInfoDraggable } from './SongListDraggable';

interface Props {
  playlist: NoxMedia.Playlist;
  playlistPaginated: UsePlaylistP;
}
export default function Fav({ playlist, playlistPaginated }: Props) {
  const {
    rows,
    page,
    defaultRowsPerPage,
    rowsPerPage,
    searchBarRef,
    handleChangePage,
    handleChangeRowsPerPage,
    getSelectedSongs,
    songsInView,
  } = playlistPaginated;
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const { colorTheme, ScrollBar } = useApp((state) => state.playerStyle);
  const playlistCRUD = usePlaylistCRUD(playlist);
  const { onPlayOneFromFav } = usePlayback();
  const {
    songObjEdited,
    songEditDialogOpen,
    openSongEditDialog,
    setSongEditDialogOpen,
  } = useRenameSong();

  const {
    removeSongs,
    handleAddToFavClick,
    updateSong,
    openAddDialog,
    onAddFav,
    actionFavSong,
    onSongListDragEnd,
  } = playlistCRUD;

  const className = ScrollBar().root;

  return (
    <React.Fragment>
      <SongRenameDialog
        openState={songEditDialogOpen}
        song={songObjEdited}
        onClose={() => setSongEditDialogOpen(false)}
        updateSong={updateSong}
      />
      <AddFavDialog
        id='AddToPlaylistSongList'
        openState={openAddDialog}
        onClose={onAddFav}
        getSongs={() => getSelectedSongs() || [actionFavSong!]}
        // MenuProps={{ style: { maxHeight: 200 } }}
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
          <SongListDraggable
            onDragEnd={(r) => onSongListDragEnd(r, playlist)}
            draggable={playlistPaginated.checking}
          >
            {songsInView().map((song, index) => (
              <SongInfoDraggable
                key={`${song.id}-${index}`}
                song={song}
                index={page * rowsPerPage + index}
                playlist={playlist}
                usePlaylist={playlistPaginated}
                openSongEditDialog={openSongEditDialog}
                draggable={playlistPaginated.checking}
              >
                <SongInfo
                  key={`${song.id}-${index}`}
                  song={song}
                  index={page * rowsPerPage + index}
                  playlist={playlist}
                  usePlaylist={playlistPaginated}
                  removeSongs={removeSongs}
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
              </SongInfoDraggable>
            ))}
          </SongListDraggable>
          <TableFooter>
            <TableRow>
              <ThemeProvider theme={theme}>
                <TablePagination
                  rowsPerPageOptions={[defaultRowsPerPage, 99, rows.length]}
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
  { id: 'name', label: '歌曲名' },
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
