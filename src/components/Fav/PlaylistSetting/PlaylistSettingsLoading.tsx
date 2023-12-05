import React from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';

import { useNoxSetting } from '@APM/stores/useApp';

interface Props {
  loading: boolean;
}
export default function FavSettingLoading({ loading }: Props) {
  const searchProgress = useNoxSetting((state) => state.searchBarProgress);

  return loading ? (
    <CircularProgress
      size={24}
      variant={searchProgress === 1 ? 'indeterminate' : 'determinate'}
      value={searchProgress * 100}
    />
  ) : (
    <AutorenewIcon />
  );
}
