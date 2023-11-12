import React from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';

import useNoxStore from '@hooks/useStore';

interface Props {
  loading: boolean;
}
export default function FavSettingLoading({ loading }: Props) {
  const playlistRefreshProgress = useNoxStore(
    (state) => state.playlistRefreshProgress,
  );

  return loading ? (
    <CircularProgress
      size={24}
      variant={
        playlistRefreshProgress === 100 ? 'indeterminate' : 'determinate'
      }
      value={playlistRefreshProgress}
    />
  ) : (
    <AutorenewIcon />
  );
}
