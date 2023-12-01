import React from 'react';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import Tooltip from '@mui/material/Tooltip';
import { SxProps } from '@mui/material';

interface Props {
  sx?: SxProps;
  playlist: NoxMedia.Playlist;
  handleCreateAsFavClick: (v: NoxMedia.Song[]) => void;
}
export default function DeletePlaylistButton({
  sx,
  playlist,
  handleCreateAsFavClick,
}: Props) {
  return (
    <Tooltip title='新建为歌单'>
      <FiberNewIcon
        sx={sx}
        onClick={() => handleCreateAsFavClick(playlist.songList)}
      />
    </Tooltip>
  );
}
