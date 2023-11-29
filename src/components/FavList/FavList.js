import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { contextMenu } from 'react-contexify';

import { useNoxSetting } from '@APM/stores/useApp';
import useFavList from '@hooks/useFavList';
import { ScrollBar } from '@styles/styles';
import { skinPreset } from '@styles/skin';
import Search from './Search';
import Menu from '../menus/Favlistmenu';
import { AddFavDialog, NewFavDialog } from '../dialogs/AddFavDialog';
import { Fav } from '../Fav/Fav';
import FavListHeader from './FavListHeader/FavListHeader';

const { colorTheme } = skinPreset;

export function FavList({ onPlayAllFromFav, playerSettings }) {
  const favoritePlaylist = useNoxSetting((state) => state.favoritePlaylist);
  const playlistShouldReRender = useNoxSetting(
    (state) => state.playlistShouldReRender,
  );
  const {
    playlists,
    playlistIds,
    searchList,
    setSearchList,
    selectedList,
    setSelectedList,
    setSongsStoredAsNewFav,
    openNewDialog,
    setOpenNewDialog,
    openAddDialog,
    actionFavId,
    actionFavSong,
    setSearchInputVal,

    handleDeleteFromSearchList,
    onNewFav,
    handleDeleteFavClick,
    handleAddToFavClick,
    onAddFav,
    onDragEnd,
    updateSubscribeFavList,
  } = useFavList();

  const handleSearch = (list) => {
    setSearchList(list);
    setSelectedList(list);
  };

  const handlePlayListClick = (FavList2) => {
    onPlayAllFromFav(FavList2);
  };

  const renderFavListItem = ({ v, i }) => {
    return (
      <React.Fragment key={i}>
        <ListItemButton
          disableRipple
          sx={outerLayerBtn}
          onContextMenu={(event, row, index) => {
            event.preventDefault();
            contextMenu.show({
              id: 'favlistmenu',
              event,
              props: {
                favlist: v,
              },
            });
          }}
        >
          <ListItemButton
            style={{ maxWidth: 'calc(100% - 84px)' }}
            onClick={() => setSelectedList(v)}
            id={v.id}
          >
            <ListItemIcon sx={DiskIcon}>
              <AlbumOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontSize: '1.1em' }}
              primary={v.title}
            />
          </ListItemButton>
          <Box component='div' sx={CRUDBtn}>
            <Tooltip title='播放歌单'>
              <PlaylistPlayIcon
                sx={CRUDIcon}
                onClick={() => handlePlayListClick(v)}
              />
            </Tooltip>
            <Tooltip title='添加到收藏歌单'>
              <AddBoxOutlinedIcon
                sx={CRUDIcon}
                onClick={() => handleAddToFavClick(v)}
              />
            </Tooltip>
            <Tooltip title='删除歌单'>
              <DeleteOutlineOutlinedIcon
                sx={CRUDIcon}
                onClick={() => handleDeleteFavClick(v.title, v.id)}
              />
            </Tooltip>
          </Box>
        </ListItemButton>
      </React.Fragment>
    );
  };

  const renderSpecialList = (specialList, handleClick = undefined) => {
    if (specialList === null) return;
    if (handleClick === undefined)
      handleClick = () => setSelectedList(specialList);

    return (
      <React.Fragment key={specialList.id}>
        <ListItemButton disableRipple sx={outerLayerBtn}>
          <ListItemButton
            style={{ maxWidth: 'calc(100% - 84px)' }}
            onClick={handleClick}
            id={specialList.id}
          >
            <ListItemIcon sx={DiskIcon}>
              <ManageSearchIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontSize: '1.1em' }}
              primary={specialList.title}
            />
          </ListItemButton>
          <Box component='div' sx={CRUDBtn}>
            <Tooltip title='播放歌单'>
              <PlaylistPlayIcon
                sx={CRUDIcon}
                onClick={() => handlePlayListClick(specialList)}
              />
            </Tooltip>
            <Tooltip title='添加到收藏歌单'>
              <AddBoxOutlinedIcon
                sx={CRUDIcon}
                onClick={() => handleAddToFavClick(specialList)}
              />
            </Tooltip>
            <Tooltip title='新建为歌单'>
              <FiberNewIcon
                sx={CRUDIcon}
                onClick={() => {
                  setSongsStoredAsNewFav(specialList.songList);
                  setOpenNewDialog(true);
                }}
              />
            </Tooltip>
          </Box>
        </ListItemButton>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Menu theme={colorTheme.generalTheme} />
      <Search
        handleSearch={handleSearch}
        handleSetSearchInputVal={setSearchInputVal}
      />
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
        <FavListHeader
          sx={AddFavIcon}
          color={colorTheme.myPlayListCaptionColor}
        />
        <NewFavDialog
          id='NewFav'
          keepMounted
          openState={openNewDialog}
          onClose={onNewFav}
        />
        <Divider light />
        <List
          style={{ overflow: 'auto', maxHeight: 'calc(100% - 50px)' }}
          className={ScrollBar().root}
          sx={{ width: '100%' }}
          component='nav'
        >
          {renderSpecialList(searchList)}
          {false &&
            renderSpecialList(favoritePlaylist, () =>
              setSelectedList(favoritePlaylist),
            )}
          {playlistIds && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='droppable'>
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {playlistIds.map((item, index) => (
                      <Draggable
                        key={`item-${index}`}
                        draggableId={`item-${index}`}
                        index={index}
                      >
                        {(provided2, snapshot2) => (
                          <div
                            ref={provided2.innerRef}
                            {...provided2.draggableProps}
                            {...provided2.dragHandleProps}
                            style={{
                              background: snapshot2.isDragging
                                ? colorTheme.clickHoldBackground
                                : null,
                              ...provided2.draggableProps.style,
                            }}
                          >
                            {renderFavListItem({
                              v: playlists[item],
                              i: index,
                            })}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </List>
      </Box>
      <Box // Mid Grid -- Fav Detail
        style={{
          maxHeight: '100%',
          paddingTop: '20px',
          paddingLeft: '20px',
          overflow: 'auto',
        }}
        sx={{ gridArea: 'Lrc', padding: '0.2em' }}
      >
        {selectedList && (
          <Fav
            FavList={selectedList}
            handleDeleteFromSearchList={handleDeleteFromSearchList}
            handleAddToFavClick={handleAddToFavClick}
            rssUpdate={(subscribeUrls) =>
              updateSubscribeFavList({
                playlist: selectedList,
                subscribeUrls,
              })
            }
            playerSettings={playerSettings}
          />
        )}
      </Box>
      {playlistIds && (
        <AddFavDialog
          id='AddFav'
          openState={openAddDialog}
          onClose={onAddFav}
          fromList={actionFavId}
          songs={[actionFavSong]}
          MenuProps={{ style: { maxHeight: 200 } }}
        />
      )}
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

const CRUDIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1.1em',
  height: '1.1em',
  paddingBottom: '2px',
  color: colorTheme.playListIconColor,
};

const AddFavIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1em',
  color: colorTheme.playListIconColor,
};

export const DiskIcon = {
  minWidth: '36px',
};
