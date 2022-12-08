import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';


export const UpdateSubscribeDialog = function ({ fromList, onClose, openState, rssUpdate }) {

  const [subUrl, setSubUrl] = useState("")
  const [favListName, setFavListName] = useState("")
  const [autoRSSUpdate, setAutoRSSUpdate] = useState(false)

  const loadRSSUrl = (subscribeUrls) => {
    try{
      console.debug('parsing fromList.subscribeUrls', subscribeUrls)
      setSubUrl(subscribeUrls.join(';'))
    } catch {
      setSubUrl("")
    }
  }

  const handleOnClose = () => {
    onClose(fromList, subUrl.split(';'), favListName);
  }

  const loadFavList = (favList = fromList) => {
    loadRSSUrl(favList.subscribeUrls)
    setFavListName(favList.info.title)
    if (favList.autoRSSUpdate) {
      setAutoRSSUpdate(true)
    }
  }

  useEffect( () => {
    loadFavList()
  }, [fromList.info.id])

  return (
    <div>
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
            autoComplete='off'
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
            autoComplete='off'
          />
          
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
              rssUpdate()
            }}>
            确认并更新订阅
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
