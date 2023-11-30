/* eslint-disable no-shadow */
import React, { useEffect, useState, useRef } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

import { zhCN } from '@mui/material/locale';
import Tooltip from '@mui/material/Tooltip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { contextMenu } from 'react-contexify';
import { useHotkeys } from 'react-hotkeys-hook';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import { getName } from '@APM/utils/re';
import usePlayer from '@hooks/usePlayer';
import { useNoxSetting } from '@APM/stores/useApp';
import useFav from '@hooks/useFav';
import { skinPreset } from '../../styles/skin';
import RandomGIFIcon from '../buttons/RandomGIF';
import { readLocalStorage } from '../../utils/ChromeStorage';
import FavSettingsButtons from './FavSetting/FavSettingsButton';
import SongSearchBar from '../dialogs/SongSearchbar';
import Menu from './Favmenu';
import SongRenameDialog from '../dialogs/SongRenameDialog';
import { ScrollBar } from '../../styles/styles';

import FavTableActions from './FavTableActions';

const { colorTheme } = skinPreset;

interface Props {
  song: NoxMedia.Song;
  index: number;
  playlist: NoxMeida.Playlist;
}
const rowRenderer = ({ song, index, playlist }: Props) => {
  return (
    <StyledTableRow
      key={index}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      onContextMenu={(event, row, index) => {
        event.preventDefault();
        contextMenu.show({
          id: 'favmenu',
          event,
          props: {
            song,
            performSearch,
            onDelete: () => handleDeleteFromSearchList(FavList.id, song.id),
            playlist,
            reloadBVid: favListReloadBVid,
            onSongEdit: () => openSongEditDialog(song),
          },
        });
      }}
    >
      <StyledTableCell
        align='left'
        sx={{
          paddingLeft: '8px',
          width: '45%',
          whiteSpace: 'nowrap',
        }}
      >
        <ListItemButton
          variant='text'
          sx={songText}
          onClick={() =>
            onPlayOneFromFav(song, {
              ...FavList,
              songList: playerSetting.keepSearchedSongListWhenPlaying
                ? rows
                : FavList.songList,
            })
          }
        >
          {song.id === currentPlayingId && (
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <PlayCircleIcon />
            </ListItemIcon>
          )}
          <ListItemText primary={getName(song, playerSetting.parseSongName)} />
        </ListItemButton>
      </StyledTableCell>
      <StyledTableCell
        align='center'
        sx={{
          width: '10%',
          fontSize: 4,
          minWidth: 0,
          color: colorTheme.uploaderCaptionColor,
          whiteSpace: 'nowrap',
        }}
        style={{ overflow: 'visible' }}
      >
        <a
          href={`https://space.bilibili.com/${song.singerId}`}
          target='_blank'
          rel='noreferrer'
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {song.singer}
        </a>
      </StyledTableCell>
      <StyledTableCell
        align='right'
        sx={{
          paddingRight: '8px',
          width: '45%',
          whiteSpace: 'nowrap',
        }}
        style={{ paddingLeft: '40px', paddingRight: '8px' }}
      >
        <Tooltip title='添加到收藏歌单'>
          <PlaylistAddIcon
            sx={CRUDIcon}
            onClick={() => handleAddToFavClick(FavList, song)}
          />
        </Tooltip>
        <Tooltip title='删除歌曲'>
          <DeleteOutlineOutlinedIcon
            sx={CRUDIcon}
            onClick={async () => {
              await handleDeleteFromSearchList(FavList.id, song.id);
              handleSearch(searchBarRef.current.value);
            }}
          />
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
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

const CRUDIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1em',
  color: colorTheme.songListIconColor,
};
