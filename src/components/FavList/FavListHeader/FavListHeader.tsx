import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material';

// eslint-disable-next-line import/no-unresolved
import PlayerSettingsButton from '@components/setting/PlayerSetttingsButton';
import useFavList from '@hooks/useFavList';
import HelpPanelButton from './HelpPanelButton';
import ShuffleAllButton from './ShuffleAllButton';
import Search from './Search';

interface Props {
  sx: SxProps;
  color?: string;
}
function FavListHeader({ sx, color }: Props) {
  const { setSearchInputVal } = useFavList();
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
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
      <Grid item xs={8} style={{ textAlign: 'right', paddingRight: '8px' }}>
        <ShuffleAllButton sx={sx} />
        <PlayerSettingsButton sx={sx} />
        <HelpPanelButton sx={sx} />
      </Grid>
    </Grid>
  );
}

export default FavListHeader;
