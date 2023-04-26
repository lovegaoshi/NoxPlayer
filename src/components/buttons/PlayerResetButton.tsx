import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ReplayIcon from '@mui/icons-material/Replay';
import { useConfirm } from 'material-ui-confirm';
import { clearStorage } from '../../utils/ChromeStorage';

export default function playerResetButton() {
  const confirm = useConfirm();

  const onClick = () => {
    confirm({
      title: '删除全部播放器歌单并重置？',
      description: '确认要重置播放器吗？',
      confirmationText: '好的',
      cancellationText: '算了',
    })
      .then(clearStorage)
      .catch();
  };

  return (
    <Button startIcon={<ReplayIcon />} onClick={onClick}>重置播放器</Button>
  );
}
