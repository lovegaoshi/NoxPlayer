import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';

export default function genericButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip title='帮助'>
      <IconButton size='large' onClick={onClick}>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  );
}
