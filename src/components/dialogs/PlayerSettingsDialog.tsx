/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import isMobile from 'is-mobile';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useStore } from 'zustand';

import playerSettingStore from '@APM/stores/playerSettingStore';
import type { NoxStorage } from '@APM/types/storage';
import { SkinKeys, skins, skinPreset } from '@styles/skin';
import { DEFAULT_SETTING, EXPORT_OPTIONS } from '@objects/Storage2';
import TimerButton from '../buttons/TimerButton';
import {
  ExportSyncFavButton as PersonalExportSyncFavButton,
  ImportSyncFavButton as PersonalImportSyncFavButton,
  SetPersonalCloudTextField,
} from '../buttons/syncing/PersonalSyncButton';
import {
  ExportSyncFavButton,
  ImportSyncFavButton,
} from '../buttons/syncing/DropboxSyncButton';
import {
  ExportFavButton,
  ImportFavButton,
} from '../buttons/syncing/LocalSyncButton';
import PlayerResetButton from '../buttons/PlayerResetButton';

const { colorTheme } = skinPreset;

interface BooleanCheckboxProps {
  settingKey: string;
  tooltip: string;
  label: string;
}
function BooleanCheckbox({ settingKey, tooltip, label }: BooleanCheckboxProps) {
  const playerSettings = useStore(
    playerSettingStore,
    (state) => state.playerSetting,
  );
  const setPlayerSettings = useStore(
    playerSettingStore,
    (state) => state.setPlayerSetting,
  );
  return (
    <Tooltip title={tooltip}>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) =>
              setPlayerSettings({ [settingKey]: e.target.checked })
            }
          />
        }
        checked={playerSettings[settingKey]}
        label={label}
      />
    </Tooltip>
  );
}

interface Props {
  onClose: Function;
  openState: boolean;
  settings: NoxStorage.PlayerSettingDict;
}
export default function SettingsDialog({
  onClose,
  openState,
  settings,
}: Props) {
  const playerSettings = useStore(
    playerSettingStore,
    (state) => state.playerSetting,
  );
  const [skin, setSkin] = useState(DEFAULT_SETTING.skin);
  const [settingExportLocation, setSettingExportLocation] = useState(
    DEFAULT_SETTING.settingExportLocation,
  );
  const [personalCloudIP, setPersonalCloudIP] = useState('');
  const [tabValue, setTabValue] = React.useState('1');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const syncSetttingButtons = () => {
    switch (settingExportLocation) {
      case EXPORT_OPTIONS.DROPBOX:
        return (
          <React.Fragment>
            {ExportSyncFavButton(AddFavIcon)}
            {ImportSyncFavButton(AddFavIcon)}
          </React.Fragment>
        );
      case EXPORT_OPTIONS.PERSONAL:
        return (
          <React.Fragment>
            {PersonalExportSyncFavButton(AddFavIcon, personalCloudIP)}
            {PersonalImportSyncFavButton(AddFavIcon, personalCloudIP)}
            {SetPersonalCloudTextField(personalCloudIP, setPersonalCloudIP)}
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            {ExportFavButton(AddFavIcon)}
            {ImportFavButton(AddFavIcon)}
          </React.Fragment>
        );
    }
  };

  const settingsPanel = () => {
    return (
      <React.Fragment>
        <Box>
          {syncSetttingButtons()}
          <TextField
            id='player-settings-sync-method-select'
            value={settingExportLocation}
            label='云同步选择'
            margin='dense'
            select
            onChange={(e) =>
              setSettingExportLocation(e.target.value as EXPORT_OPTIONS)
            }
            style={{ minWidth: 100 }}
          >
            {Object.values(EXPORT_OPTIONS).map((v, i) => {
              return (
                <MenuItem key={i} value={v}>
                  {v}
                </MenuItem>
              );
            })}
          </TextField>
        </Box>
        <Tooltip title={skins(skin).maintainerTooltip}>
          <Typography
            style={{ color: colorTheme.songListColumnHeaderColor }}
            display='inline'
          >
            播放器皮肤{' '}
          </Typography>
        </Tooltip>
        <Typography
          style={{ color: colorTheme.songListColumnHeaderColor }}
          display='inline'
        >
          (maintained by&nbsp;
        </Typography>
        {skins(skin).maintinerURL ? (
          <Link
            style={{
              color: colorTheme.songListColumnHeaderColor,
              fontSize: '1rem',
            }}
            href={skins(skin).maintinerURL}
            target='_blank'
            display='inline'
          >
            {skins(skin).maintainer}
          </Link>
        ) : (
          <Typography
            style={{ color: colorTheme.songListColumnHeaderColor }}
            display='inline'
          >
            {skins(skin).maintainer}
          </Typography>
        )}
        <Typography
          style={{ color: colorTheme.songListColumnHeaderColor }}
          display='inline'
        >
          )
        </Typography>
        <br />
        <TextField
          id='player-settings-skin-select'
          value={skin}
          select
          SelectProps={{
            MenuProps: { PaperProps: { sx: { maxHeight: '40vh' } } },
          }}
          onChange={(e) => setSkin(e.target.value)}
        >
          {SkinKeys.map((v, i) => {
            return (
              <MenuItem key={i} value={v}>
                {v}
              </MenuItem>
            );
          })}
        </TextField>
        <div />
        <BooleanCheckbox
          settingKey='parseSongName'
          tooltip='在歌单里显示提取后的歌名'
          label='使用提取的歌名'
        />
        <BooleanCheckbox
          settingKey='autoRSSUpdate'
          tooltip='每天打开歌单时自动更新歌单的订阅'
          label='自动更新订阅'
        />
        <BooleanCheckbox
          settingKey='keepSearchedSongListWhenPlaying'
          tooltip='搜索歌单时，按搜索的结果播放歌单'
          label='播放搜索结果歌单'
        />
        {isMobile() && (
          <BooleanCheckbox
            settingKey='hideCoverInMobile'
            tooltip='移动端不显示歌封面'
            label='移动端不显示歌封面'
          />
        )}
        <BooleanCheckbox
          settingKey='loadPlaylistAsArtist'
          tooltip='播放歌单时显示歌手为歌单名'
          label='播放显示歌单名称'
        />
        <BooleanCheckbox
          settingKey='sendBiliHeartbeat'
          tooltip='不发送b站播放API（用来增加视频播放数）
          API不会使用b号cookie'
          label='不发送b站播放API'
        />
        <BooleanCheckbox
          settingKey='noCookieBiliSearch'
          tooltip='不用b站cookie，关闭搜索时的b站个性化推荐'
          label='搜索时不用b号个性化推荐'
        />
        <BooleanCheckbox
          settingKey='fastBiliSearch'
          tooltip='搜索时不解析分p内容'
          label='快速b站搜索'
        />
        <BooleanCheckbox
          settingKey='r128gain'
          tooltip='启用即时r128gain'
          label='r128gain'
        />
      </React.Fragment>
    );
  };

  return (
    <Dialog open={openState}>
      <DialogTitle>播放器设置</DialogTitle>
      <DialogContent>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleTabChange}
              aria-label='lab API tabs example'
            >
              <Tab icon={<SettingsIcon />} label='设置' value='1' />
              <Tab icon={<BuildIcon />} label='工具箱' value='2' />
            </TabList>
          </Box>
          <TabPanel value='1'>{settingsPanel()}</TabPanel>
          <TabPanel value='2'>
            <TimerButton AddFavIcon={undefined} btnType='regular' />
            <PlayerResetButton />
            <Button startIcon={<BuildIcon />}>placeholder</Button>
            <br />
            <Button startIcon={<BuildIcon />}>placeholder</Button>
            <Button startIcon={<BuildIcon />}>placeholder</Button>
            <Button startIcon={<BuildIcon />}>placeholder</Button>
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(playerSettings)}>好的</Button>
      </DialogActions>
    </Dialog>
  );
}

const AddFavIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1em',
  color: colorTheme.playListIconColor,
  // padding added to account for the textfield label margin:dense
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '8px',
  paddingRight: '8px',
};
