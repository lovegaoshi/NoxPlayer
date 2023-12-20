import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import usePlaylistSetting from '@APM/components/playlist/Menu/usePlaylistSetting';

interface Props {
  playlist: NoxMedia.Playlist;
  onClose: () => void;
  openState: boolean;
  rssUpdate: (v: string[]) => void;
  onCancel: () => void;
  id: string;
}

export default function FavSettingsDialog({
  playlist,
  onClose,
  openState,
  rssUpdate,
  onCancel,
  id,
}: Props) {
  const {
    subscribeUrl,
    setSubscribeUrl,
    blacklistedUrl,
    setBlacklistedUrl,
    title,
    setTitle,
    useBiliShazam,
    useBiliSync,
    toggleBiliShazam,
    toggleBiliSync,
    saveSetting,
    loadSetting,
  } = usePlaylistSetting(playlist);

  const handleClose = () => {
    saveSetting();
    onClose();
  };

  const handleCancel = () => {
    loadSetting();
    onCancel();
  };

  return (
    <Dialog open={openState} id={id} onClose={handleCancel}>
      <DialogTitle>
        <TextField
          autoFocus
          margin='dense'
          id='name'
          label='歌单名称'
          type='name'
          variant='standard'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          autoComplete='off'
        />
      </DialogTitle>
      <DialogContent>
        <TextField
          margin='dense'
          id='rssname'
          label='订阅url'
          type='name'
          variant='standard'
          onChange={(e) => setSubscribeUrl(e.target.value)}
          value={subscribeUrl}
          autoComplete='off'
          placeholder='这些url会被订阅'
        />
        <div />
        <TextField
          margin='dense'
          id='bannedBVids'
          label='黑名单BV号'
          type='name'
          variant='standard'
          onChange={(e) => setBlacklistedUrl(e.target.value)}
          value={blacklistedUrl}
          autoComplete='off'
          placeholder='这些bvid不会被订阅'
        />
        <div />
        <Tooltip title='使用b站识歌API（王胡桃专用）'>
          <FormControlLabel
            control={<Checkbox onChange={toggleBiliShazam} />}
            checked={useBiliShazam}
            label='使用b站识歌API'
          />
        </Tooltip>
        <div />
        <Tooltip title='自动同步为b站收藏夹'>
          <FormControlLabel
            control={<Checkbox onChange={toggleBiliSync} />}
            checked={useBiliSync}
            label='自动同步为b站收藏夹'
          />
        </Tooltip>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>取消</Button>
        <Button onClick={handleClose}>确认</Button>
        <Button
          onClick={() => {
            handleClose();
            rssUpdate(subscribeUrl.split(';'));
          }}
        >
          确认并更新订阅
        </Button>
      </DialogActions>
    </Dialog>
  );
}
