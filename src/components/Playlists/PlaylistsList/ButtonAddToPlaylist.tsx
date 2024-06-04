import React from 'react';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Tooltip from '@mui/material/Tooltip';
import { SxProps } from '@mui/material';

interface Props {
  sx?: SxProps;
  handleAddToFavClick: () => void;
}
export default function DeletePlaylistButton({
  sx,
  handleAddToFavClick,
}: Props) {
  return (
    <Tooltip title='添加到收藏歌单'>
      <AddBoxOutlinedIcon sx={sx} onClick={() => handleAddToFavClick()} />
    </Tooltip>
  );
}
