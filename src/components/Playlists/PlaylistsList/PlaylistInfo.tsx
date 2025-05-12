import React from 'react';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { contextMenu } from 'react-contexify';

import useApp, { useNoxSetting } from '@stores/useApp';
import AddToPlaylistButton from './ButtonAddToPlaylist';
import DeletePlaylistButton from './ButtonDeletePlaylist';
import PlayPlaylistButton from './ButtonPlayPlaylist';
import CreateAsPlaylistButton from './ButtonCreateAsPlaylist';

interface PlaylistInfoBaseProps extends Props {
  enableMenu?: boolean;
  albumIcon?: React.ReactNode;
  children?: React.ReactNode;
}
function PlaylistInfoBase({
  playlist,
  enableMenu = playlist.type === 'typical',
  albumIcon = <AlbumOutlinedIcon />,
  children,
}: PlaylistInfoBaseProps) {
  const playerStyle = useApp((state) => state.playerStyle);
  const { DiskIcon, outerLayerBtn } = playerStyle;
  const currentPlayingList = useNoxSetting((state) => state.currentPlayingList);
  const currentPlayList = useNoxSetting((state) => state.currentPlaylist);
  const setSelectedList = useNoxSetting((state) => state.setCurrentPlaylist);
  const getPlaylist = useNoxSetting((state) => state.getPlaylist);
  const currentPlaying = currentPlayingList?.id === playlist.id;
  const currentSelected = currentPlayList?.id === playlist.id;

  return (
    <ListItemButton
      disableRipple
      sx={[
        outerLayerBtn,
        currentSelected && {
          backgroundColor: playerStyle.colorTheme.clickHoldBackground,
        },
      ]}
      onContextMenu={
        enableMenu
          ? (event) => {
              event.preventDefault();
              contextMenu.show({
                id: 'favlistmenu',
                event,
                props: {
                  favlist: playlist,
                },
              });
            }
          : undefined
      }
    >
      <ListItemButton
        style={{ flex: 1 }}
        onClick={() => getPlaylist(playlist.id).then(setSelectedList)}
        id={playlist.id}
      >
        <Box
          sx={[
            style.playingBar,
            /*
            currentPlaying && {
              backgroundColor: playerStyle.colorTheme.playListIconColor,
            },
            */
          ]}
        />
        <ListItemIcon sx={DiskIcon}>
          {currentPlaying ? <PlayCircleIcon /> : albumIcon}
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{ fontSize: '1.1em' }}
          primary={playlist.title}
        />
      </ListItemButton>
      {children}
    </ListItemButton>
  );
}

interface Props {
  playlist: NoxMedia.Playlist;
  handleAddToFavClick: (playlist: NoxMedia.Playlist) => void;
  onPlayAllFromFav: (playlist: NoxMedia.Playlist) => void;
  handleDeleteFavClick: (playlist: NoxMedia.Playlist) => void;
  handleCreateAsFavClick: (playlist: NoxMedia.Song[]) => void;
}

export function PlaylistInfo(props: Props) {
  const {
    playlist,
    handleAddToFavClick,
    onPlayAllFromFav,
    handleDeleteFavClick,
  } = props;
  const playerStyle = useApp((state) => state.playerStyle);
  const { CRUDBtn, CRUDIcon } = playerStyle;
  const getPlaylist = useNoxSetting((state) => state.getPlaylist);

  return (
    <PlaylistInfoBase {...props}>
      <Box component='div' sx={CRUDBtn}>
        <PlayPlaylistButton
          sx={CRUDIcon}
          onPlayAllFromFav={() =>
            getPlaylist(playlist.id).then(onPlayAllFromFav)
          }
        />
        <AddToPlaylistButton
          sx={CRUDIcon}
          handleAddToFavClick={() => handleAddToFavClick(playlist)}
        />
        <DeletePlaylistButton
          sx={CRUDIcon}
          handleDeleteFavClick={() => handleDeleteFavClick(playlist)}
        />
      </Box>
    </PlaylistInfoBase>
  );
}

export function SearchlistEntry(props: Props) {
  const {
    playlist,
    handleAddToFavClick,
    onPlayAllFromFav,
    handleCreateAsFavClick,
  } = props;
  const { CRUDBtn, CRUDIcon } = useApp((state) => state.playerStyle);
  const getPlaylist = useNoxSetting((state) => state.getPlaylist);

  return (
    <PlaylistInfoBase {...props} albumIcon={<ManageSearchIcon />}>
      <Box component='div' sx={CRUDBtn}>
        <PlayPlaylistButton
          sx={CRUDIcon}
          onPlayAllFromFav={() => onPlayAllFromFav(playlist)}
        />
        <AddToPlaylistButton
          sx={CRUDIcon}
          handleAddToFavClick={() => handleAddToFavClick(playlist)}
        />
        <CreateAsPlaylistButton
          sx={CRUDIcon}
          handleCreateAsFavClick={() =>
            getPlaylist(playlist.id).then((v) =>
              handleCreateAsFavClick(v.songList),
            )
          }
        />
      </Box>
    </PlaylistInfoBase>
  );
}

const style = {
  playingBar: {
    width: '7px',
    marginLeft: '-7px',
    height: '36px',
    marginBottom: '-6px',
    marginTop: '-6px',
  },
};
