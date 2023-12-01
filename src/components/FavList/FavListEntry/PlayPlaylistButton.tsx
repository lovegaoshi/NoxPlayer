import React from 'react';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import Tooltip from '@mui/material/Tooltip';
import { SxProps } from '@mui/material';

interface Props {
  sx?: SxProps;
  playlist: NoxMedia.Playlist;
  onPlayAllFromFav: (v: NoxMedia.Playlist) => void;
}
export default function DeletePlaylistButton({
  sx,
  playlist,
  onPlayAllFromFav,
}: Props) {
  return (
    <Tooltip title='播放歌单'>
      <PlaylistPlayIcon sx={sx} onClick={() => onPlayAllFromFav(playlist)} />
    </Tooltip>
  );
}
