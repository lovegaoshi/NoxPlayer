import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

import type { NoxStorage } from '@APM/types/storage';
import { useNoxSetting } from '@APM/stores/useApp';
import SettingsDialog from './PlayerSettingsDialog';

export default function playerSettingsButton({
  AddFavIcon,
}: {
  AddFavIcon: Object;
}) {
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const setPlayerSetting = useNoxSetting((state) => state.setPlayerSetting);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

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
          if (settings) setPlayerSetting(settings);
          setOpenSettingsDialog(false);
        }}
        settings={playerSetting}
      />
    </React.Fragment>
  );
}
