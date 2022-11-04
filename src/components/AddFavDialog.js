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
import Input from '@mui/material/Input';
import { Checkbox } from '@mui/material';
import { SkinKeys, skins, skinPreset } from '../styles/skin';
import FormControlLabel from '@mui/material/FormControlLabel';

let colorTheme = skinPreset.colorTheme;

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
            autoComplete='off'
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

export const AddFavDialog = function ({ onClose, openState, fromId, favLists, song }) {
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
          
          <FormControlLabel 
            control={<Checkbox onChange={e => { setAutoRSSUpdate(e.target.checked) }}/>} 
            label="自动更新" 
            sx={{ paddingLeft: '16px', paddingTop: '12px' }}
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


export const SettingsDialog = function ({ onClose, openState, settings }) {
  const [skin, setSkin] = useState('诺莺nox')
  const [settingObj, setSettingObj] = useState({})
  const [parseSongName, setParseSongName] = useState(false)

  async function init() {
    settings = await settings
    setSettingObj(settings)
    let skinIndex = SkinKeys.indexOf(settings.skin)
    if (skinIndex !== -1) {
      setSkin(settings.skin)
    } else {
      setSkin(SkinKeys[0])
    }
    if (settings.parseSongName !== undefined) {
      setParseSongName(settings.parseSongName)
    } else {
      setParseSongName(false)
    }
  }
  // load settings into this dialog
  useEffect( () => {
    init()
  }, [])

  const handleCancel = () => {
    init()
    onClose()
  }

  const handleOK = () => {
    let updatedSettingObj = settingObj
    updatedSettingObj.skin = skin
    updatedSettingObj.parseSongName = parseSongName
    onClose(updatedSettingObj)
  }

  const onSkinSelect = (e) => {
    setSkin(e.target.value)
  }

  return (
    <div>
      <Dialog open={openState}>
        <DialogTitle>播放器设置</DialogTitle>
        <DialogContent>
          <p style={{ color:colorTheme.songIconColor }}>播放器皮肤 (maintained by {skins(skin).maintainer})</p>
          <Select
            labelId="player-settings-skin-select"
            id="player-settings-skin-select"
            value={skin}
            label="选择皮肤"
            onChange={onSkinSelect}
          >
            {SkinKeys.map((v, i) => {
                return (<MenuItem key={i} value={v}>{v}</MenuItem>)
            })}
          </Select>
          <p/>
          <FormControlLabel 
            control={<Checkbox onChange={e => { setParseSongName(e.target.checked) }}/>} 
            checked={parseSongName}
            label="使用提取的歌名" 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={handleOK}>确认</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
