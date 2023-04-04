import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { SkinKeys, skins, skinPreset } from '../../styles/skin';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import isMobile from 'is-mobile';
import { DEFAULT_SETTING, EXPORT_OPTIONS } from '../../objects/Storage';
import { ExportFavButton, ImportFavButton } from "../buttons/ImportExport";
import { ExportSyncFavButton, ImportSyncFavButton } from "../buttons/syncing/DropboxSyncButton";
import { 
  ExportSyncFavButton as PersonalExportSyncFavButton,
  ImportSyncFavButton as PersonalImportSyncFavButton,
  setPersonalCloudTextField 
} from "../buttons/syncing/PersonalSyncButton";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import TimerButton from '../buttons/TimerButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PlayerResetButton from '../buttons/PlayerResetButton';

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
  const [skin, setSkin] = useState(DEFAULT_SETTING.skin);
  const [settingObj, setSettingObj] = useState({});
  const [parseSongName, setParseSongName] = useState(DEFAULT_SETTING.parseSongName);
  const [autoRSSUpdate, setAutoRSSUpdate] = useState(DEFAULT_SETTING.autoRSSUpdate);
  const [settingExportLocation, setSettingExportLocation] = useState(DEFAULT_SETTING.settingExportLocation);
  const [keepSearchedSongListWhenPlaying, setKeepSearchedSongListWhenPlaying] = useState(DEFAULT_SETTING.keepSearchedSongListWhenPlaying);
  const [personalCloudIP, setPersonalCloudIP] = useState("");
  const [hideCoverInMobile, setHideCoverInMobile] = useState(DEFAULT_SETTING.hideCoverInMobile);
  const [tabValue, setTabValue] = React.useState('1');
  const [loadPlaylistAsArtist, setLoadPlaylistAsArtist] = useState(DEFAULT_SETTING.loadPlaylistAsArtist);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const setSettings = (setFunc, value = undefined, defaultValue = undefined) => {
    if (value !== undefined) {
      setFunc(value);
    } else if (defaultValue !== undefined) {
      setFunc(defaultValue);
    }
  }

  async function init() {
    settings = await settings;
    setSettingObj(settings);
    let skinIndex = SkinKeys.indexOf(settings.skin);
    if (skinIndex !== -1) {
      setSkin(settings.skin);
    } else {
      setSkin(SkinKeys[0]);
    }
    setSettings(setParseSongName, settings.parseSongName);
    setSettings(setAutoRSSUpdate, settings.autoRSSUpdate);
    setSettings(setSettingExportLocation, settings.settingExportLocation);
    setSettings(setKeepSearchedSongListWhenPlaying, settings.keepSearchedSongListWhenPlaying);
    setSettings(setPersonalCloudIP, settings.personalCloudIP, "");
    setSettings(setHideCoverInMobile, settings.hideCoverInMobile);
    setSettings(setLoadPlaylistAsArtist, settings.loadPlaylistAsArtist);
  }
  // load settings into this dialog
  useEffect( () => {
    init();
  }, [])

  const handleCancel = () => {
    init();
    onClose();
  }

  const handleOK = () => {
    let updatedSettingObj = {
      ...settingObj,
      skin, parseSongName, autoRSSUpdate, settingExportLocation,
      keepSearchedSongListWhenPlaying, personalCloudIP, hideCoverInMobile,
      loadPlaylistAsArtist,
    };
    onClose(updatedSettingObj);
    return;
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
      case EXPORT_OPTIONS.personal:
        return (
          <React.Fragment>
            {PersonalExportSyncFavButton(AddFavIcon, personalCloudIP)}
            {PersonalImportSyncFavButton(AddFavIcon, personalCloudIP)}
            {setPersonalCloudTextField(personalCloudIP, setPersonalCloudIP)}
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

  const settingsPanel = () => {
    return (
      <React.Fragment>
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
            <Typography style={{ color:colorTheme.songListColumnHeaderColor }} display="inline">播放器皮肤 </Typography>
        </Tooltip>
        <Typography style={{ color:colorTheme.songListColumnHeaderColor }} display="inline">(maintained by&nbsp;</Typography>
        {
          skins(skin).maintinerURL
          ? <Link style={{ color:colorTheme.songListColumnHeaderColor, fontSize: "1rem" }} href={skins(skin).maintinerURL} target="_blank" display="inline">{skins(skin).maintainer}</Link>
          : <Typography style={{ color:colorTheme.songListColumnHeaderColor }} display="inline">{skins(skin).maintainer}</Typography>
        }
        <Typography style={{ color:colorTheme.songListColumnHeaderColor }} display="inline">)</Typography>
        <br></br>
        <TextField
          id="player-settings-skin-select"
          value={skin}
          select
          SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: '40vh' } } } }}
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
        {isMobile() && (
          <Tooltip title='移动端不显示歌封面'>
          <FormControlLabel 
            control={<Checkbox onChange={e => { setHideCoverInMobile(e.target.checked) }}/>} 
            checked={hideCoverInMobile}
            label="移动端不显示歌封面"
          />
          </Tooltip>
        )}
        <Tooltip title='播放歌单时显示歌手为歌单名'>
          <FormControlLabel 
            control={<Checkbox onChange={e => { setLoadPlaylistAsArtist(e.target.checked) }}/>} 
            checked={loadPlaylistAsArtist}
            label="播放显示歌单名称"
          />
        </Tooltip>
      </React.Fragment>
    )
  }

  return (
    <Dialog open={openState}>
      <DialogTitle>播放器设置</DialogTitle>
        <DialogContent>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                <Tab icon={<SettingsIcon/>} label="设置" value="1" />
                <Tab icon={<BuildIcon/>} label="工具箱" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {settingsPanel()}
            </TabPanel>
            <TabPanel value="2">
              <TimerButton btnType="regular"/>
              <PlayerResetButton></PlayerResetButton>
              <Button startIcon={<BuildIcon/>}>placeholder</Button>
              <br/>
              <Button startIcon={<BuildIcon/>}>placeholder</Button>
              <Button startIcon={<BuildIcon/>}>placeholder</Button>
              <Button startIcon={<BuildIcon/>}>placeholder</Button>
            </TabPanel>
          </TabContext>          
        </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>取消</Button>
        <Button onClick={handleOK}>确认</Button>
      </DialogActions>
    </Dialog>
  );
}
