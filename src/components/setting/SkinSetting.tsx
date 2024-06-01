import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useStore } from 'zustand';

import playerSettingStore from '@APM/stores/playerSettingStore';
import { SkinMap } from '@styles/skin';
import useApp from '@stores/useApp';

export default function SkinSetting() {
  const playerSettings = useStore(
    playerSettingStore,
    (state) => state.playerSetting,
  );
  const setPlayerSettings = useStore(
    playerSettingStore,
    (state) => state.setPlayerSetting,
  );
  const playerStyle = useApp((state) => state.playerStyle);
  const setPlayerStyle = useApp((state) => state.setPlayerStyle);

  return (
    <Box>
      <Tooltip title={playerStyle.maintainerTooltip}>
        <Typography
          style={{ color: playerStyle.colorTheme.songListColumnHeaderColor }}
          display='inline'
        >
          播放器皮肤{' '}
        </Typography>
      </Tooltip>
      <Typography
        style={{ color: playerStyle.colorTheme.songListColumnHeaderColor }}
        display='inline'
      >
        (maintained by&nbsp;
      </Typography>
      {playerStyle.maintinerURL ? (
        <Link
          style={{
            color: playerStyle.colorTheme.songListColumnHeaderColor,
            fontSize: '1rem',
          }}
          href={playerStyle.maintinerURL}
          target='_blank'
          display='inline'
        >
          {playerStyle.maintainer}
        </Link>
      ) : (
        <Typography
          style={{ color: playerStyle.colorTheme.songListColumnHeaderColor }}
          display='inline'
        >
          {playerStyle.maintainer}
        </Typography>
      )}
      <Typography
        style={{ color: playerStyle.colorTheme.songListColumnHeaderColor }}
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
        onChange={(e) => {
          setPlayerSettings({ skin: e.target.value });
          setPlayerStyle(e.target.value);
        }}
      >
        {Object.keys(SkinMap).map((v, i) => {
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
