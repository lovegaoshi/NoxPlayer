import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { SxProps } from '@mui/material';

interface Props {
  sx?: SxProps;
}
function ShuffleAll({ sx }: Props) {
  return (
    <Tooltip title='全歌单播放'>
      <IconButton size='large' onClick={() => {}}>
        <ShuffleIcon sx={sx} />
      </IconButton>
    </Tooltip>
  );
}

export default ShuffleAll;
