import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useStore } from 'zustand';

import { skinPreset } from '@styles/skin';
import playerSettingStore from '@APM/stores/playerSettingStore';
import { EXPORT_OPTIONS } from '@objects/Storage';
import useInitializeStore from '@stores/useInitializeStore';
import {
  ExportSyncFavButton as PersonalExportSyncFavButton,
  ImportSyncFavButton as PersonalImportSyncFavButton,
  SetPersonalCloudTextField,
} from './sync/PersonalSyncButton';
import { ExportFavButton, ImportFavButton } from './sync/LocalSyncButton';
import DropboxSyncButton from './sync/DropboxAuth';
import GiteeSyncButton from './sync/GiteeAuth';

function SyncSetttingButtons() {
  const playerSettings = useStore(
    playerSettingStore,
    (state) => state.playerSetting,
  );
  const setPlayerSettings = useStore(
    playerSettingStore,
    (state) => state.setPlayerSetting,
  );
  const { initializeFromSync } = useInitializeStore();

  switch (playerSettings.settingExportLocation) {
    case EXPORT_OPTIONS.DROPBOX:
      return (
        <DropboxSyncButton
          sx={AddFavIcon}
          restoreFromUint8Array={async (v) => {
            await initializeFromSync(v);
          }}
        />
      );
    case EXPORT_OPTIONS.GITEE:
      return (
        <GiteeSyncButton
          sx={AddFavIcon}
          restoreFromUint8Array={async (v) => {
            await initializeFromSync(v);
          }}
        />
      );
    case EXPORT_OPTIONS.PERSONAL:
      return (
        <React.Fragment>
          <PersonalExportSyncFavButton
            AddFavIcon={AddFavIcon}
            cloudAddress={playerSettings.personalCloudIP}
          />
          <PersonalImportSyncFavButton
            AddFavIcon={AddFavIcon}
            cloudAddress={playerSettings.personalCloudIP}
          />
          <SetPersonalCloudTextField
            cloudAddress={playerSettings.personalCloudIP}
            setCloudAddress={(val: string) =>
              setPlayerSettings({ personalCloudIP: val })
            }
          />
        </React.Fragment>
      );
    default:
      return (
        <React.Fragment>
          <ExportFavButton AddFavIcon={AddFavIcon} />
          <ImportFavButton AddFavIcon={AddFavIcon} />
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
