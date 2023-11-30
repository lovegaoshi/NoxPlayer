import React from 'react';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { contextMenu } from 'react-contexify';

import AddToPlaylistButton from './AddToPlaylistButton';
import DeletePlaylistButton from './DeletePlaylistButton';
import PlayPlaylistButton from './PlayPlaylistButton';
import CreateAsPlaylistButton from './CreateAsPlaylistButton';
import { CRUDBtn, CRUDIcon, DiskIcon, outerLayerBtn } from '../Styles';

interface Props {
  playlist: NoxMedia.Playlist;
  key: string;
  setSelectedList: (playlist: NoxMedia.Playlist) => void;
  handleAddToFavClick: (playlist: NoxMedia.Playlist) => void;
  onPlayAllFromFav: (playlist: NoxMedia.Playlist) => void;
  handleDeleteFavClick: (playlist: NoxMedia.Playlist) => void;
  handleCreateAsFavClick: (playlist: NoxMedia.Song[]) => void;
}

export function PlaylistEntry({
  playlist,
  key,
  setSelectedList,
  handleAddToFavClick,
  onPlayAllFromFav,
  handleDeleteFavClick,
}: Props) {
  return (
    <React.Fragment key={key}>
      <ListItemButton
        disableRipple
        sx={outerLayerBtn}
        onContextMenu={(event) => {
          event.preventDefault();
          contextMenu.show({
            id: 'favlistmenu',
            event,
            props: {
              favlist: playlist,
            },
          });
        }}
      >
        <ListItemButton
          style={{ maxWidth: 'calc(100% - 84px)' }}
          onClick={() => setSelectedList(playlist)}
          id={playlist.id}
        >
          <ListItemIcon sx={DiskIcon}>
            <AlbumOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ fontSize: '1.1em' }}
            primary={playlist.title}
          />
        </ListItemButton>
        <Box component='div' sx={CRUDBtn}>
          <PlayPlaylistButton
            sx={CRUDIcon}
            playlist={playlist}
            onPlayAllFromFav={onPlayAllFromFav}
          />
          <AddToPlaylistButton
            sx={CRUDIcon}
            playlist={playlist}
            handleAddToFavClick={handleAddToFavClick}
          />
          <DeletePlaylistButton
            sx={CRUDIcon}
            playlist={playlist}
            handleDeleteFavClick={handleDeleteFavClick}
          />
        </Box>
      </ListItemButton>
    </React.Fragment>
  );
}

export function SearchlistEntry({
  playlist,
  setSelectedList,
  handleAddToFavClick,
  onPlayAllFromFav,
  handleCreateAsFavClick,
}: Props) {
  return (
    <React.Fragment key={playlist.id}>
      <ListItemButton disableRipple sx={outerLayerBtn}>
        <ListItemButton
          style={{ maxWidth: 'calc(100% - 84px)' }}
          onClick={() => setSelectedList(playlist)}
          id={playlist.id}
        >
          <ListItemIcon sx={DiskIcon}>
            <ManageSearchIcon />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ fontSize: '1.1em' }}
            primary={playlist.title}
          />
        </ListItemButton>
        <Box component='div' sx={CRUDBtn}>
          <PlayPlaylistButton
            sx={CRUDIcon}
            playlist={playlist}
            onPlayAllFromFav={onPlayAllFromFav}
          />
          <AddToPlaylistButton
            sx={CRUDIcon}
            playlist={playlist}
            handleAddToFavClick={handleAddToFavClick}
          />
          <CreateAsPlaylistButton
            sx={CRUDIcon}
            playlist={playlist}
            handleCreateAsFavClick={handleCreateAsFavClick}
          />
        </Box>
      </ListItemButton>
    </React.Fragment>
  );
}
