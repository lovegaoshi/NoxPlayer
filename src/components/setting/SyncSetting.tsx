import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useStore } from 'zustand';

import useApp from '@stores/useApp';
import { useNoxSetting } from '@APM/stores/useApp';
import { SyncOptions } from '@enums/Storage';
import useInitializeStore from '@stores/useInitializeStore';
import {
  ExportSyncFavButton as PersonalExportSyncFavButton,
  ImportSyncFavButton as PersonalImportSyncFavButton,
  SetPersonalCloudTextField,
} from './sync/PersonalSyncButton';
import { ExportFavButton, ImportFavButton } from './sync/LocalSyncButton';
import DropboxSyncButton from './sync/DropboxAuth';
import GiteeSyncButton from './sync/GiteeAuth';
import GithubSyncButton from './sync/GithubAuth';

function SyncSetttingButtons() {
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const setPlayerSetting = useNoxSetting((state) => state.setPlayerSetting);
  const { initializeFromSync } = useInitializeStore();
  const { colorTheme } = useApp((state) => state.playerStyle);
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

  switch (playerSetting.settingExportLocation) {
    case SyncOptions.DROPBOX:
      return (
        <DropboxSyncButton
          sx={AddFavIcon}
          restoreFromUint8Array={async (v) => {
            initializeFromSync(v);
          }}
        />
      );
    case SyncOptions.GITEE:
      return (
        <GiteeSyncButton
          sx={AddFavIcon}
          restoreFromUint8Array={async (v) => {
            initializeFromSync(v);
          }}
        />
      );
    case SyncOptions.GITHUB:
      return (
        <GithubSyncButton
          sx={AddFavIcon}
          restoreFromUint8Array={async (v) => {
            initializeFromSync(v);
          }}
        />
      );
    case SyncOptions.PERSONAL:
      return (
        <React.Fragment>
          <PersonalExportSyncFavButton
            AddFavIcon={AddFavIcon}
            cloudAddress={playerSetting.personalCloudIP}
          />
          <PersonalImportSyncFavButton
            AddFavIcon={AddFavIcon}
            cloudAddress={playerSetting.personalCloudIP}
          />
          <SetPersonalCloudTextField
            cloudAddress={playerSetting.personalCloudIP}
            setCloudAddress={(val: string) =>
              setPlayerSetting({ personalCloudIP: val })
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
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const setPlayerSetting = useNoxSetting((state) => state.setPlayerSetting);

  return (
    <Box>
      <TextField
        id='player-settings-sync-method-select'
        value={playerSetting.settingExportLocation}
        label='云同步选择'
        margin='dense'
        select
        onChange={(e) =>
          setPlayerSetting({
            settingExportLocation: e.target.value as SyncOptions,
          })
        }
        style={{ minWidth: 100 }}
      >
        {Object.values(SyncOptions).map((v, i) => {
          return (
            <MenuItem key={i} value={v}>
              {v}
            </MenuItem>
          );
        })}
      </TextField>
      <SyncSetttingButtons />
    </Box>
  );
}
