/* eslint-disable no-shadow */
import React from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TableRow from '@mui/material/TableRow';

import Tooltip from '@mui/material/Tooltip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { contextMenu } from 'react-contexify';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import { getName } from '@APM/utils/re';
import { useNoxSetting } from '@APM/stores/useApp';
import { skinPreset } from '../../../styles/skin';

const { colorTheme } = skinPreset;

interface Props {
  song: NoxMedia.Song;
  index: number;
  key: string;
  playlist: NoxMedia.Playlist;
  performSearch: (v: string) => void;
  handleDeleteFromSearchList: (i: string, j: string) => Promise<void>;
  favListReloadBVid: (bvid: string) => void;
  openSongEditDialog: (song: NoxMedia.Song) => void;
  playSong: (v: NoxMedia.Song) => void;
  searchBarRef: any;
  handleAddToFavClick: (p: NoxMedia.Playlist, s: NoxMedia.Song) => void;
}
function SongInfo({
  song,
  index,
  playlist,
  performSearch,
  handleDeleteFromSearchList,
  favListReloadBVid,
  openSongEditDialog,
  playSong,
  searchBarRef,
  handleAddToFavClick,
}: Props) {
  const currentPlayingId = useNoxSetting((state) => state.currentPlayingId);
  const playerSetting = useNoxSetting((state) => state.playerSetting);

  return (
    <StyledTableRow
      key={`song-${index}`}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      onContextMenu={(event) => {
        event.preventDefault();
        contextMenu.show({
          id: 'favmenu',
          event,
          props: {
            song,
            performSearch,
            onDelete: () => handleDeleteFromSearchList(playlist.id, song.id),
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
        <ListItemButton sx={songText} onClick={() => playSong(song)}>
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
            onClick={() => handleAddToFavClick(playlist, song)}
          />
        </Tooltip>
        <Tooltip title='删除歌曲'>
          <DeleteOutlineOutlinedIcon
            sx={CRUDIcon}
            onClick={async () => {
              await handleDeleteFromSearchList(playlist.id, song.id);
              performSearch(searchBarRef.current.value);
            }}
          />
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default SongInfo;

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

const CRUDIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1em',
  color: colorTheme.songListIconColor,
};
export const songText = {
  fontSize: 16,
  minWidth: 0,
  overflow: 'hidden',
  paddingBottom: '4px',
  paddingTop: '4px',
};
