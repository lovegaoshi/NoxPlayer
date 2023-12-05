import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { ScrollBar } from '@styles/styles';
import useFavList from '@hooks/useFavList';
import { skinPreset } from '@styles/skin';
import usePlayer from '@hooks/usePlayer';
// eslint-disable-next-line import/no-unresolved
import { AddFavDialog, NewFavDialog } from '@components/dialogs/AddFavDialog';
import Search from './FavListHeader/Search';
import PlaylistHeaderButtons from './FavListHeader/PlaylistHeaderButtons';
import PlaylistList from './FavListEntry/PlaylistList';
import { SearchlistEntry } from './FavListEntry/PlaylistEntry';

const { colorTheme } = skinPreset;

export default function () {
  const { onPlayAllFromFav } = usePlayer({});
  const {
    setSearchInputVal,
    searchList,
    setSelectedList,
    setSongsStoredAsNewFav,
    openNewDialog,
    setOpenNewDialog,
    openAddDialog,
    actionFavId,
    actionFavSong,

    onNewFav,
    handleDeleteFavClick,
    handleAddToFavClick,
    onAddFav,
  } = useFavList();

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

        <List
          style={{ overflow: 'auto', maxHeight: 'calc(100% - 50px)' }}
          className={ScrollBar().root}
          sx={{ width: '100%' }}
          component='nav'
        >
          <SearchlistEntry
            key2='key'
            playlist={searchList}
            setSelectedList={setSelectedList}
            handleAddToFavClick={handleAddToFavClick}
            onPlayAllFromFav={onPlayAllFromFav}
            handleCreateAsFavClick={(v) => {
              setSongsStoredAsNewFav(v);
              setOpenNewDialog(true);
            }}
            handleDeleteFavClick={handleDeleteFavClick}
          />
          <PlaylistList />
        </List>
      </Box>
      <NewFavDialog id='NewFav' openState={openNewDialog} onClose={onNewFav} />
      <AddFavDialog
        id='AddFav'
        openState={openAddDialog}
        onClose={onAddFav}
        fromList={actionFavId}
        songs={actionFavSong === undefined ? [] : [actionFavSong]}
        // MenuProps={{ style: { maxHeight: 200 } }}
      />
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
