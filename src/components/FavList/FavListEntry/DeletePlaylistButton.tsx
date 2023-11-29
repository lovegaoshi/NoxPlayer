import React from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import { SxProps } from '@mui/material';

interface Props {
  sx?: SxProps;
  playlist: NoxMedia.Playlist;
  handleDeleteFavClick: (v: NoxMedia.Playlist) => void;
}
export default function DeletePlaylistButton({
  sx,
  playlist,
  handleDeleteFavClick,
}: Props) {
  return (
    <Tooltip title='删除歌单'>
      <DeleteOutlineOutlinedIcon
        sx={sx}
        onClick={() => handleDeleteFavClick(playlist)}
      />
    </Tooltip>
  );
}
