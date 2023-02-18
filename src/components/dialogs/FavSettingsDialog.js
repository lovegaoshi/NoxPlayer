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

export default function ({ fromList, onClose, openState, rssUpdate }) {

  const [subUrl, setSubUrl] = useState("")
  const [bannedBVids, setBannedBVids] = useState("")
  const [favListName, setFavListName] = useState("")
  const [useBiliShazam, setUseBiliShazam] = useState(false)

  if (fromList === undefined) {
    return (
      <></>
    );
  }

  const setArrayAsStr = (val, setFunc = setSubUrl) => {
    try{
      setFunc(val.join(';'))
    } catch {
      setFunc("")
    }
  }

  const handleOnClose = () => {
    onClose(
      fromList,
      {
        subscribeUrls: subUrl.split(';'), 
        favListName: favListName,
        useBiliShazam: useBiliShazam,
        bannedBVids: bannedBVids.split(';')
      });
  }

  const loadFavList = (favList = fromList) => {
    setArrayAsStr(favList.subscribeUrls, setSubUrl)
    setArrayAsStr(favList.bannedBVids, setBannedBVids)
    setFavListName(favList.info.title)
    setUseBiliShazam(favList.useBiliShazam ? true : false)
  }

  useEffect( () => {
    loadFavList()
  }, [fromList.info.id])

  return (
    <Dialog open={openState}>
      <DialogTitle>
      <TextField
          autoFocus
          margin="dense"
          id="name"
          label="歌单名称"
          type="name"
          variant="standard"
          onChange={(e) => setFavListName(e.target.value)}
          value={favListName}
          autoComplete="off"
        />  
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="rssname"
          label="订阅url"
          type="name"
          variant="standard"
          onChange={(e) => setSubUrl(e.target.value)}
          value={subUrl}
          autoComplete="off"
        />
        <div/>
        <TextField
          autoFocus
          margin="dense"
          id="bannedBVids"
          label="黑名单BV号"
          type="name"
          variant="standard"
          onChange={(e) => setBannedBVids(e.target.value)}
          value={bannedBVids}
          autoComplete="off"
        />
        <div/>
        <Tooltip title='使用b站识歌API（王胡桃专用）'>
          <FormControlLabel 
            control={<Checkbox onChange={e => { setUseBiliShazam(e.target.checked) }}/>} 
            checked={useBiliShazam}
            label="使用b站识歌API"
          />
        </Tooltip>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            loadFavList()
            onClose()
          }}>取消</Button>
        <Button onClick={handleOnClose}>确认</Button>
        <Button 
          onClick={() => {
            handleOnClose()
            rssUpdate(subUrl.split(';'))
          }}>
          确认并更新订阅
        </Button>
      </DialogActions>
    </Dialog>
  );
}
