import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material';

import PlayerSettingsButton from '@components/setting/PlayerSetttingsButton';
import HelpPanelButton from './HelpPanelButton';
import ShuffleAllButton from './ShuffleAllButton';

interface Props {
  sx: SxProps;
  color?: string;
}
export default function PlaylistHeaderButtons({ sx, color }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <Typography
          variant='subtitle1'
          style={{
            color,
            paddingLeft: '8px',
            paddingTop: '12px',
          }}
        >
          我的歌单
        </Typography>
      </Grid>
      <Grid size={8} style={{ textAlign: 'right', paddingRight: '8px' }}>
        <ShuffleAllButton sx={sx} />
        <PlayerSettingsButton sx={sx} />
        <HelpPanelButton sx={sx} />
      </Grid>
    </Grid>
  );
}
