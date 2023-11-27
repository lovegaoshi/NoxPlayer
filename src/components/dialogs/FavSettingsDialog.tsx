import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { PlayListDict } from '@utils/ChromeStorage';

interface props {
  fromList: PlayListDict;
  onClose: Function;
  openState: boolean;
  rssUpdate: Function;
  onCancel: Function;
  id: string;
}

export default function FavSettingsDialog({
  fromList,
  onClose,
  openState,
  rssUpdate,
  onCancel,
  id,
}: props) {
  const [subUrl, setSubUrl] = useState('');
  const [bannedBVids, setBannedBVids] = useState('');
  const [favListName, setFavListName] = useState('');
  const [useBiliShazam, setUseBiliShazam] = useState(false);
  const [biliSync, setBiliSync] = useState(false);

  if (fromList === undefined) return null;

  const setArrayAsStr = (val: Array<string>, setFunc = setSubUrl) => {
    try {
      setFunc(val.join(';'));
    } catch {
      setFunc('');
    }
  };

  const handleClose = () => {
    onClose(fromList, {
      subscribeUrls: Array.from(new Set(subUrl.split(';'))),
      favListName,
      useBiliShazam,
      biliSync,
      bannedBVids: Array.from(new Set(bannedBVids.split(';'))),
    });
  };

  const loadFavList = (favList = fromList) => {
    setArrayAsStr(favList.subscribeUrls, setSubUrl);
    setArrayAsStr(favList.bannedBVids, setBannedBVids);
    setFavListName(favList.title);
    setUseBiliShazam(!!favList.useBiliShazam);
    setBiliSync(!!favList.biliSync);
  };

  useEffect(() => {
    loadFavList();
  }, [fromList.id, fromList.songList.length]);

  return (
    <Dialog open={openState} id={id}>
      <DialogTitle>
        <TextField
          autoFocus
          margin='dense'
          id='name'
          label='歌单名称'
          type='name'
          variant='standard'
          onChange={(e) => setFavListName(e.target.value)}
          value={favListName}
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
          onChange={(e) => setSubUrl(e.target.value)}
          value={subUrl}
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
          onChange={(e) => setBannedBVids(e.target.value)}
          value={bannedBVids}
          autoComplete='off'
          placeholder='这些bvid不会被订阅'
        />
        <div />
        <Tooltip title='使用b站识歌API（王胡桃专用）'>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  setUseBiliShazam(e.target.checked);
                }}
              />
            }
            checked={useBiliShazam}
            label='使用b站识歌API'
          />
        </Tooltip>
        <div />
        <Tooltip title='自动同步为b站收藏夹'>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => {
                  setBiliSync(e.target.checked);
                }}
              />
            }
            checked={biliSync}
            label='自动同步为b站收藏夹'
          />
        </Tooltip>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            loadFavList();
            onCancel();
          }}
        >
          取消
        </Button>
        <Button onClick={handleClose}>确认</Button>
        <Button
          onClick={() => {
            handleClose();
            rssUpdate(subUrl.split(';'));
          }}
        >
          确认并更新订阅
        </Button>
      </DialogActions>
    </Dialog>
  );
}
