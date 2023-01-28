import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Checkbox } from '@mui/material';
import { SkinKeys, skins, skinPreset } from '../../styles/skin';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';

let colorTheme = skinPreset.colorTheme;

export const SettingsDialog = function ({ onClose, openState, settings,
    importFavButton = () => {},
    exportFavButton = () => {}, 
    importSyncFavButton = () => {}, 
    exportSyncFavButton = () => {}, 
  }) {
  const [skin, setSkin] = useState('诺莺nox')
  const [settingObj, setSettingObj] = useState({})
  const [parseSongName, setParseSongName] = useState(false)
  const [autoRSSUpdate, setAutoRSSUpdate] = useState(false)

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
    if (settings.autoRSSUpdate !== undefined) {
      setAutoRSSUpdate(settings.autoRSSUpdate)
    } else {
      setAutoRSSUpdate(false)
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
    updatedSettingObj.autoRSSUpdate = autoRSSUpdate
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
        <Box>
          {exportFavButton()}
          {importFavButton()}
          {exportSyncFavButton()}
          {importSyncFavButton()}
        </Box>
          <Tooltip title={skins(skin).maintainerTooltip}>
            <p style={{ color:colorTheme.songListColumnHeaderColor }}>播放器皮肤 (maintained by {skins(skin).maintainer})</p>
          </Tooltip>
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
          <Tooltip title='选定后，会在歌单里显示提取后的歌名而非原本的视频标题；歌词搜索会一直使用提取后的歌名'>
            <FormControlLabel 
              control={<Checkbox onChange={e => { setParseSongName(e.target.checked) }}/>} 
              checked={parseSongName}
              label="使用提取的歌名" 
            />
          </Tooltip>
          <Tooltip title='选定后，每天自动更新歌单的订阅'>
            <FormControlLabel 
              control={<Checkbox onChange={e => { setAutoRSSUpdate(e.target.checked) }}/>} 
              checked={autoRSSUpdate}
              label="自动更新订阅"
            />
          </Tooltip>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={handleOK}>确认</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
