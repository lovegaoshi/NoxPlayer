import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function genericButton({ onClick }) {
  return (
    <Tooltip title="帮助">
      <IconButton size="large" onClick={onClick}>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  );
}
