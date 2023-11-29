import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import { contextMenu } from 'react-contexify';

import AddToPlaylistButton from './AddToPlaylistButton';
import DeletePlaylistButton from './DeletePlaylistButton';
import PlayPlaylistButton from './PlayPlaylistButton';

interface Props {
  playlist: NoxMedia.Playlist;
  key: string;
}

export default function PlaylistEntry({ playlist, key }: Props) {
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
              updateFavList: (val) => {
                const newList = { ...val };
                updatePlaylist(newList);
                setSelectedList(newList);
              },
            },
          });
        }}
      >
        <ListItemButton
          style={{ maxWidth: 'calc(100% - 84px)' }}
          onClick={() => setSelectedList(v)}
          id={v.id}
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
          <AddToPlaylistButton
            sx={CRUDIcon}
            playlist={playlist}
            handleAddToFavClick={handleAddToFavClick}
          />
          <Tooltip title='添加到收藏歌单'>
            <AddBoxOutlinedIcon
              sx={CRUDIcon}
              onClick={() => handleAddToFavClick(v)}
            />
          </Tooltip>
          <Tooltip title='删除歌单'>
            <DeleteOutlineOutlinedIcon
              sx={CRUDIcon}
              onClick={() => handleDeleteFavClick(v.title, v.id)}
            />
          </Tooltip>
        </Box>
      </ListItemButton>
    </React.Fragment>
  );
}
