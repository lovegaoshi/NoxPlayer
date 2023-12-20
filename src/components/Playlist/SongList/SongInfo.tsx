/* eslint-disable no-shadow */
import React from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Checkbox from '@mui/material/Checkbox';

import Tooltip from '@mui/material/Tooltip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import { getName } from '@APM/utils/re';
import { useNoxSetting } from '@APM/stores/useApp';
import useApp from '@stores/useApp';
import { UsePlaylistP } from '../hooks/usePlaylistPaginated';

interface Props {
  song: NoxMedia.Song;
  index: number;
  key: string;
  playlist: NoxMedia.Playlist;
  usePlaylist: UsePlaylistP;
  removeSongs: (
    s: NoxMedia.Song[],
    ban?: boolean,
    p?: NoxMedia.Playlist,
  ) => void;
  playSong: (v: NoxMedia.Song) => void;
  searchBarRef: any;
  handleAddToFavClick: (p: NoxMedia.Playlist, s: NoxMedia.Song) => void;
}
function SongInfo({
  song,
  index,
  playlist,
  usePlaylist,
  removeSongs,
  playSong,
  searchBarRef,
  handleAddToFavClick,
}: Props) {
  const currentPlayingId = useNoxSetting((state) => state.currentPlayingId);
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const {
    performSearch,
    toggleSelected,
    getSongIndex,
    getSelectedSongs,
    selected,
  } = usePlaylist;
  const { colorTheme } = useApp((state) => state.playerStyle);
  const CRUDIcon = {
    ':hover': {
      cursor: 'pointer',
    },
    width: '1em',
    color: colorTheme.songListIconColor,
  };
  const [, setSelectState] = React.useState(
    selected[getSongIndex(song, index)] || false,
  );

  return (
    <React.Fragment>
      <StyledTableCell align='left' sx={styles.tableCell}>
        {usePlaylist.checking && (
          <Checkbox
            sx={styles.selectCheckbox}
            checked={selected[getSongIndex(song, index)] || false}
            onChange={() => {
              toggleSelected(getSongIndex(song, index));
              setSelectState((val) => !val);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        )}
        <ListItemButton sx={styles.songText} onClick={() => playSong(song)}>
          {song.id === currentPlayingId && (
            <ListItemIcon sx={styles.listItemIcon}>
              <PlayCircleIcon />
            </ListItemIcon>
          )}
          <ListItemText primary={getName(song, playerSetting.parseSongName)} />
        </ListItemButton>
      </StyledTableCell>
      <StyledTableCell
        align='center'
        sx={[
          styles.tableCellUp,
          {
            color: colorTheme.uploaderCaptionColor,
          },
        ]}
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
        sx={styles.tableCellBtns}
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
              // console.log(getSelectedSongs() || [song]);
              removeSongs(getSelectedSongs() || [song], false, playlist);
              performSearch(searchBarRef.current.value);
              usePlaylist.setChecking(false);
              usePlaylist.resetSelected();
            }}
          />
        </Tooltip>
      </StyledTableCell>
    </React.Fragment>
  );
}

export default SongInfo;

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

const styles = {
  tableCell: {
    paddingLeft: '8px',
    // width: '45%',
    display: 'flex',
    whiteSpace: 'nowrap',
  },
  selectCheckbox: { padding: '0px', paddingLeft: '7px' },
  songText: {
    fontSize: 16,
    minWidth: 0,
    overflow: 'hidden',
    paddingBottom: '4px',
    paddingTop: '4px',
  },
  listItemIcon: { minWidth: '30px' },
  tableCellUp: {
    width: '10%',
    fontSize: 4,
    minWidth: 0,
    whiteSpace: 'nowrap',
  },
  tableCellBtns: {
    paddingRight: '8px',
    width: '45%',
    whiteSpace: 'nowrap',
  },
};
