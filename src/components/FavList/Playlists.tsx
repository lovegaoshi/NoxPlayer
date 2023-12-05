import React from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import useFavList from '@hooks/useFavList';
import { skinPreset } from '@styles/skin';
import Search from './FavListHeader/Search';
import PlaylistHeaderButtons from './FavListHeader/PlaylistHeaderButtons';
import PlaylistList from './FavListEntry/PlaylistList';

const { colorTheme } = skinPreset;

export default function () {
  const { setSearchInputVal } = useFavList();

  return (
    <React.Fragment>
      <Search setSearchInputVal={setSearchInputVal} />
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

        <PlaylistList />
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
