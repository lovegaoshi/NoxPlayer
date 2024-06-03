import React from 'react';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import Tooltip from '@mui/material/Tooltip';
import { SxProps } from '@mui/material';

interface Props {
  sx?: SxProps;
  handleCreateAsFavClick: () => void;
}
export default function DeletePlaylistButton({
  sx,
  handleCreateAsFavClick,
}: Props) {
  return (
    <Tooltip title='新建为歌单'>
      <FiberNewIcon sx={sx} onClick={() => handleCreateAsFavClick()} />
    </Tooltip>
  );
}
