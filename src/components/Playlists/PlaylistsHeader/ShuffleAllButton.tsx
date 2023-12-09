import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { SxProps } from '@mui/material';

import { useNoxSetting } from '@APM/stores/useApp';
import usePlayback from '@hooks/usePlayback';

interface Props {
  sx?: SxProps;
}
function ShuffleAll({ sx }: Props) {
  const playlists = useNoxSetting((state) => state.playlists);
  const { loadToSearchListAndPlay } = usePlayback({});

  const shuffleAll = () => {
    const allSongs = Object.values(playlists).reduce(
      (acc, curr) => acc.concat(curr.songList),
      [] as NoxMedia.Song[],
    );
    loadToSearchListAndPlay(allSongs);
  };

  return (
    <Tooltip title='全歌单播放'>
      <IconButton size='large' onClick={shuffleAll}>
        <ShuffleIcon sx={sx} />
      </IconButton>
    </Tooltip>
  );
}

export default ShuffleAll;