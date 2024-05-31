import React from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import useApp from '@stores/useApp';
import usePlaylistCRUD from '@hooks/usePlaylistCRUD';
import Search from './PlaylistsHeader/Search';
import PlaylistHeaderButtons from './PlaylistsHeader/PlaylistHeaderButtons';
import PlaylistList from './PlaylistsList/PlaylistList';

export default function Playlists() {
  const playlistCRUD = usePlaylistCRUD();
  const { colorTheme } = useApp((state) => state.playerStyle);
  const AddFavIcon = {
    ':hover': {
      cursor: 'pointer',
    },
    width: '1em',
    color: colorTheme.playListIconColor,
  };

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
