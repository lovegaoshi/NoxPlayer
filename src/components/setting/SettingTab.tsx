import React from 'react';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import TabPanel from '@mui/lab/TabPanel';
import { useTranslation } from 'react-i18next';

import { useNoxSetting } from '@APM/stores/useApp';
import SyncSetting from './SyncSetting';
import SkinSetting from './SkinSetting';
import SETTING_TAB from './enums';

interface BooleanCheckboxProps {
  settingKey: string;
  settingCategory?: string;
  tooltip?: string;
  label?: string;
  callback?: () => void;
}
function BooleanCheckbox({
  settingKey,
  tooltip,
  label,
  settingCategory = 'GeneralSettings',
  callback,
}: BooleanCheckboxProps) {
  const { t } = useTranslation();
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const setPlayerSetting = useNoxSetting((state) => state.setPlayerSetting);

  return (
    <Tooltip title={tooltip ?? t(`${settingCategory}.${settingKey}Desc`)}>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) => {
              setPlayerSetting({ [settingKey]: e.target.checked });
              callback?.();
            }}
          />
        }
        checked={playerSetting[settingKey]}
        label={label ?? t(`${settingCategory}.${settingKey}Name`)}
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
      <BooleanCheckbox settingKey='parseSongName' />
      <BooleanCheckbox settingKey='autoRSSUpdate' />
      <BooleanCheckbox settingKey='keepSearchedSongListWhenPlaying' />
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
      <BooleanCheckbox settingKey='noCookieBiliSearch' />
      <BooleanCheckbox settingKey='fastBiliSearch' />
      <BooleanCheckbox settingKey='r128gain' />
      <BooleanCheckbox
        settingKey='memoryEfficiency'
        callback={window.location.reload}
      />
      <BooleanCheckbox settingKey='noBiliR128Gain' />
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
