import React from 'react';
import Box from '@mui/material/Box';

import useApp from '@stores/useApp';
import Menu from '../menus/PlaylistMenu';
import Fav from '../Playlist/Playlist';
import Playlists from './Playlists';

export function FavList() {
  const { colorTheme } = useApp((state) => state.playerStyle);

  return (
    <React.Fragment>
      <Menu theme={colorTheme.generalTheme} />
      <Playlists />
      <Box // Mid Grid -- Fav Detail
        style={{
          maxHeight: '100%',
          paddingTop: '20px',
          paddingLeft: '20px',
          overflow: 'auto',
        }}
        sx={{ gridArea: 'Lrc', padding: '0.2em' }}
      >
        <Fav />
      </Box>
    </React.Fragment>
  );
}

export const outerLayerBtn = { padding: 'unset' };

export const CRUDBtn = {
  ':hover': {
    cursor: 'default',
  },
  paddingLeft: '8px',
  paddingRight: '8px',
};

export const DiskIcon = {
  minWidth: '36px',
};
