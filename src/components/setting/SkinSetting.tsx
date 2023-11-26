import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useStore } from 'zustand';

import playerSettingStore from '@APM/stores/playerSettingStore';
import { SkinKeys, skins, skinPreset } from '@styles/skin';

const { colorTheme } = skinPreset;

export default function SkinSetting() {
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
      <Tooltip title={skins(playerSettings.skin).maintainerTooltip}>
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
      {skins(playerSettings.skin).maintinerURL ? (
        <Link
          style={{
            color: colorTheme.songListColumnHeaderColor,
            fontSize: '1rem',
          }}
          href={skins(playerSettings.skin).maintinerURL}
          target='_blank'
          display='inline'
        >
          {skins(playerSettings.skin).maintainer}
        </Link>
      ) : (
        <Typography
          style={{ color: colorTheme.songListColumnHeaderColor }}
          display='inline'
        >
          {skins(playerSettings.skin).maintainer}
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
        value={playerSettings.skin}
        select
        SelectProps={{
          MenuProps: { PaperProps: { sx: { maxHeight: '40vh' } } },
        }}
        onChange={(e) => setPlayerSettings({ skin: e.target.value })}
      >
        {SkinKeys.map((v, i) => {
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
