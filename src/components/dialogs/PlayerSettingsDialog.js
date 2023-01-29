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
import { defaultSetting, EXPORT_OPTIONS } from '../../objects/Storage';
import TextField from '@mui/material/TextField';
import { ExportFavButton, ImportFavButton } from "../buttons/ImportExport";
import { ExportSyncFavButton, ImportSyncFavButton } from "../buttons/DropboxSyncButton";

let colorTheme = skinPreset.colorTheme;

const AddFavIcon = {
  ':hover': {
      cursor: 'pointer'
  },
  width: '1em',
  color: colorTheme.playListIconColor,
  // padding added to account for the textfield label margin:dense
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '8px',
  paddingRight: '8px',
}

export const SettingsDialog = function ({ onClose, openState, settings }) {
  const [skin, setSkin] = useState(defaultSetting.skin)
  const [settingObj, setSettingObj] = useState({})
  const [parseSongName, setParseSongName] = useState(defaultSetting.parseSongName)
  const [autoRSSUpdate, setAutoRSSUpdate] = useState(defaultSetting.autoRSSUpdate)
  const [settingExportLocation, setSettingExportLocation] = useState(defaultSetting.settingExportLocation)
  const [keepSearchedSongListWhenPlaying, setKeepSearchedSongListWhenPlaying] = useState(defaultSetting.keepSearchedSongListWhenPlaying)
  
  const setSettings = (setFunc, value = undefined, defaultValue = undefined) => {
    if (value !== undefined) {
      setFunc(value);
    } else if (defaultValue !== undefined) {
      setFunc(defaultValue);
    }
  }

  async function init() {
    settings = await settings
    setSettingObj(settings)
    let skinIndex = SkinKeys.indexOf(settings.skin)
    if (skinIndex !== -1) {
      setSkin(settings.skin)
    } else {
      setSkin(SkinKeys[0])
    }
    setSettings(setParseSongName, settings.parseSongName);
    setSettings(setAutoRSSUpdate, settings.autoRSSUpdate);
    setSettings(setSettingExportLocation, settings.settingExportLocation);
    setSettings(setKeepSearchedSongListWhenPlaying, settings.keepSearchedSongListWhenPlaying);
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
    updatedSettingObj.settingExportLocation = settingExportLocation
    updatedSettingObj.keepSearchedSongListWhenPlaying = keepSearchedSongListWhenPlaying
    onClose(updatedSettingObj)
  }

  const syncSetttingButtons = () => {
    switch (settingExportLocation) {
      case EXPORT_OPTIONS.dropbox:
        return (
          <React.Fragment>
            {ExportSyncFavButton(AddFavIcon)}
            {ImportSyncFavButton(AddFavIcon)}
          </React.Fragment>
        )
    }
    return (
      <React.Fragment>
        {ExportFavButton(AddFavIcon)}
        {ImportFavButton(AddFavIcon)}
      </React.Fragment>
    )
  }

  return (
    <div>
      <Dialog open={openState}>
        <DialogTitle>播放器设置</DialogTitle>
        <DialogContent>
        <Box>
          {syncSetttingButtons()}
          <TextField
            id="player-settings-sync-method-select"
            value={settingExportLocation}
            label="云同步选择"
            margin="dense"
            select
            onChange={(e) => setSettingExportLocation(e.target.value)}
            style={{ minWidth: 100 }}
          >
            {Object.values(EXPORT_OPTIONS).map((v, i) => {
                return (<MenuItem key={i} value={v}>{v}</MenuItem>)
            })}
          </TextField>
        </Box>
          <Tooltip title={skins(skin).maintainerTooltip}>
            <p style={{ color:colorTheme.songListColumnHeaderColor }}>播放器皮肤 (maintained by {skins(skin).maintainer})</p>
          </Tooltip>
          <TextField
            id="player-settings-skin-select"
            value={skin}
            select
            onChange={(e) => setSkin(e.target.value)}
          >
            {SkinKeys.map((v, i) => {
                return (<MenuItem key={i} value={v}>{v}</MenuItem>)
            })}
          </TextField>
          <div/>
          <Tooltip title='在歌单里显示提取后的歌名'>
            <FormControlLabel 
              control={<Checkbox onChange={e => { setParseSongName(e.target.checked) }}/>} 
              checked={parseSongName}
              label="使用提取的歌名" 
            />
          </Tooltip>
          <Tooltip title='每天打开歌单时自动更新歌单的订阅'>
            <FormControlLabel 
              control={<Checkbox onChange={e => { setAutoRSSUpdate(e.target.checked) }}/>} 
              checked={autoRSSUpdate}
              label="自动更新订阅"
            />
          </Tooltip>
          <div/>
          <Tooltip title='搜索歌单时，按搜索的结果播放歌单'>
            <FormControlLabel 
              control={<Checkbox onChange={e => { setKeepSearchedSongListWhenPlaying(e.target.checked) }}/>} 
              checked={keepSearchedSongListWhenPlaying}
              label="播放搜索结果歌单"
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
