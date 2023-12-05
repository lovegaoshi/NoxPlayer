import React from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { skinPreset } from '@styles/skin';
import usePlaylistCRUD from '@hooks/usePlaylistCRUD';
import Search from './FavListHeader/Search';
import PlaylistHeaderButtons from './FavListHeader/PlaylistHeaderButtons';
import PlaylistList from './FavListEntry/PlaylistList';

const { colorTheme } = skinPreset;

export default function () {
  const playlistCRUD = usePlaylistCRUD();

  return (
    <React.Fragment>
      <Search setSearchInputVal={playlistCRUD.setSearchInputVal} />
      <br />
      <Box // Mid Grid -- SideBar
        style={{
          overflow: 'hidden',
          marginTop: '18px',
          maxHeight: 'calc(100vh - 208px)',
          backgroundColor: colorTheme.FavListBackgroundColor,
        }}
        sx={{ gridArea: 'sidebar' }}
      >
        <PlaylistHeaderButtons
          sx={AddFavIcon}
          color={colorTheme.myPlayListCaptionColor}
        />
        <Divider light />

        <PlaylistList playlistCRUD={playlistCRUD} />
      </Box>
    </React.Fragment>
  );
}

const AddFavIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1em',
  color: colorTheme.playListIconColor,
};
