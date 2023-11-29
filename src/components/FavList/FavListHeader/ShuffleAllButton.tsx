import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { contextMenu } from 'react-contexify';

import { defaultSearchList } from '@objects/Playlist';
import { useNoxSetting } from '@APM/stores/useApp';

interface Props {
  sx?: Object;
}
function ShuffleAll({ sx }: Props) {
  const handleSearch = (list) => {
    setSearchList(list);
    setSelectedList(list);
  };

  const loadToSearchList = (songList) => {
    handleSearch(defaultSearchList({ songList }));
    onPlayAllFromFav({ songList });
  };
  const shuffleAll = () => {
    const allSongs = Object.values(playlists).reduce(
      (acc, curr) => acc.concat(curr.songList),
      [],
    );
    loadToSearchList(allSongs);
  };

  return (
    <Tooltip title='全歌单播放'>
      <IconButton size='large' onClick={shuffleAll}>
        <ShuffleIcon sx={sx} />
      </IconButton>
    </Tooltip>
  );
}

export default ShuffleAll;
