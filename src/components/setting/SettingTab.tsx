import React from 'react';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import isMobile from 'is-mobile';
import TabPanel from '@mui/lab/TabPanel';
import { useStore } from 'zustand';

import playerSettingStore from '@APM/stores/playerSettingStore';
import SyncSetting from './SyncSetting';
import SkinSetting from './SkinSetting';
import SETTING_TAB from './enums';

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

function SettingsPanel() {
  return (
    <React.Fragment>
      <SyncSetting />
      <SkinSetting />
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
}
export default function SettingTab() {
  return (
    <TabPanel value={SETTING_TAB.GENERAL}>
      <SettingsPanel />
    </TabPanel>
  );
}
