import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useStore } from 'zustand';

import { skinPreset } from '@styles/skin';
import playerSettingStore from '@APM/stores/playerSettingStore';
import { EXPORT_OPTIONS } from '@objects/Storage2';
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

function SyncSetttingButtons() {
  const playerSettings = useStore(
    playerSettingStore,
    (state) => state.playerSetting,
  );
  const setPlayerSettings = useStore(
    playerSettingStore,
    (state) => state.setPlayerSetting,
  );

  switch (playerSettings.settingExportLocation) {
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
          {PersonalExportSyncFavButton(
            AddFavIcon,
            playerSettings.personalCloudIP,
          )}
          {PersonalImportSyncFavButton(
            AddFavIcon,
            playerSettings.personalCloudIP,
          )}
          {SetPersonalCloudTextField(
            playerSettings.personalCloudIP,
            (val: EXPORT_OPTIONS) =>
              setPlayerSettings({ settingExportLocation: val }),
          )}
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
}

export default function SyncSetting() {
  const playerSettings = useStore(
    playerSettingStore,
    (state) => state.playerSetting,
  );
  const setPlayerSettings = useStore(
    playerSettingStore,
    (state) => state.setPlayerSetting,
  );

  return (
    <Box>
      <SyncSetttingButtons />
      <TextField
        id='player-settings-sync-method-select'
        value={playerSettings.settingExportLocation}
        label='云同步选择'
        margin='dense'
        select
        onChange={(e) =>
          setPlayerSettings({
            settingExportLocation: e.target.value as EXPORT_OPTIONS,
          })
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
  );
}

const { colorTheme } = skinPreset;

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
