import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Input from '@mui/material/Input';

export const NewFavDialog = function ({ onClose, openState }) {
  const [favName, setfavName] = useState('')

  const handleCancel = () => {
    onClose()
    setfavName('')
  }

  const onfavName = (e) => {
    setfavName(e.target.value)
  }

  const handleOK = () => {
    onClose(favName)
    setfavName('')
  }

  return (
    <div>
      <Dialog open={openState}>
        <DialogTitle>新建歌单</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="歌单名字"
            type="name"
            variant="standard"
            onChange={onfavName}
            value={favName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          {favName == '' ?
            <Button disabled>确认</Button> :
            <Button onClick={handleOK}>确认</Button>}

        </DialogActions>
      </Dialog>
    </div>
  );
}

export const AddFavDialog = function ({ onClose, openState, fromId, favLists, song, onNewFav }) {
  const [favId, setfavId] = useState('')

  const handleCancel = () => {
    onClose()
    setfavId('')
  }

  const onfavId = (e) => {
    setfavId(e.target.value)
  }

  const handleOK = () => {
    onClose(fromId, favId, song)
    setfavId('')
  }

  return (
    <div>
      <Dialog open={openState}>
        <DialogTitle>添加到歌单</DialogTitle>
        <DialogContent style={{ paddingTop: '24px' }}>
          <Box sx={{ minWidth: 400, minHeight: 50 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">添加到歌单</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={favId}
                label="FavLists"
                onChange={onfavId}
                input={(<Input></Input>)}
              >
                {favLists && favLists.map((v, i) => {
                  if (v.id != fromId)
                    return (<MenuItem key={i} value={v.id}>{v.title}</MenuItem>)
                })}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          {favId == '' ?
            <Button disabled>确认</Button> :
            <Button onClick={handleOK}>确认</Button>}

        </DialogActions>
      </Dialog>
    </div>
  );
}


export const UpdateSubscribeDialog = function ({ fromList, onClose, openState }) {

  const [subUrl, setSubUrl] = useState("")

  useEffect( () => {
    try{
      console.debug('parsing fromList.subscribeUrls', fromList.subscribeUrls)
      setSubUrl(fromList.subscribeUrls.join(';'))
    } catch {
      setSubUrl("")
    }
  }, [fromList.info.id])

  return (
    <div>
      <Dialog open={openState}>
        <DialogTitle>{fromList.info.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="订阅url"
            type="name"
            variant="standard"
            onChange={(e) => setSubUrl(e.target.value)}
            value={subUrl}
            autoComplete='off'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>取消</Button>
          <Button onClick={() => onClose(fromList, subUrl.split(';'))}>确认</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
