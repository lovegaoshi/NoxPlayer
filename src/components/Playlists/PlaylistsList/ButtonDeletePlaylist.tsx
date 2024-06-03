import React from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import { SxProps } from '@mui/material';

interface Props {
  sx?: SxProps;
  handleDeleteFavClick: () => void;
}
export default function DeletePlaylistButton({
  sx,
  handleDeleteFavClick,
}: Props) {
  return (
    <Tooltip title='删除歌单'>
      <DeleteOutlineOutlinedIcon sx={sx} onClick={handleDeleteFavClick} />
    </Tooltip>
  );
}
