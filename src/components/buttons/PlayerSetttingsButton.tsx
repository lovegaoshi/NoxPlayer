import React, { useState, useContext } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

import type { NoxStorage } from '@APM/types/storage';
import { StorageManagerCtx } from '@contexts/StorageManagerContext';
import SettingsDialog from '../dialogs/PlayerSettingsDialog';

export default function playerSettingsButton({
  AddFavIcon,
}: {
  AddFavIcon: Object;
}) {
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const StorageManager = useContext(StorageManagerCtx);

  return (
    <React.Fragment>
      <Tooltip title='播放器设置'>
        <IconButton size='large' onClick={() => setOpenSettingsDialog(true)}>
          <SettingsIcon sx={AddFavIcon} />
        </IconButton>
      </Tooltip>
      <SettingsDialog
        openState={openSettingsDialog}
        onClose={(settings: NoxStorage.PlayerSettingDict) => {
          if (settings) StorageManager.setPlayerSetting(settings);
          setOpenSettingsDialog(false);
        }}
        settings={StorageManager.getPlayerSetting()}
      />
    </React.Fragment>
  );
}
