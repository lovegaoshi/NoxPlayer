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
  const [favListName, setFavListName] = useState("")
  const [useBiliShazam, setUseBiliShazam] = useState(false)

  if (fromList === undefined) {
    return (
      <></>
    );
  }

  const loadRSSUrl = (subscribeUrls) => {
    try{
      console.debug('parsing fromList.subscribeUrls', subscribeUrls)
      setSubUrl(subscribeUrls.join(';'))
    } catch {
      setSubUrl("")
    }
  }

  const handleOnClose = () => {
    onClose({
      listObj: fromList,
      urls: subUrl.split(';'), 
      favListName: favListName,
      useBiliShazam: useBiliShazam,
    });
  }

  const loadFavList = (favList = fromList) => {
    loadRSSUrl(favList.subscribeUrls)
    setFavListName(favList.info.title)
    setUseBiliShazam(favList.info.useBiliShazam ? true : false)
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
        <Tooltip title='使用b站识歌API（单线程，很慢；王胡桃专用）'>
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
            onClose({})
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
