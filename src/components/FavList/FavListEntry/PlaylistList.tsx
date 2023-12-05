import React from 'react';
import List from '@mui/material/List';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import useFavList from '@/components/FavList/useFavList';
import { ScrollBar } from '@styles/styles';
import { useNoxSetting } from '@APM/stores/useApp';
// eslint-disable-next-line import/no-unresolved
import { AddFavDialog, NewFavDialog } from '@components/dialogs/AddFavDialog';
import { skinPreset } from '@styles/skin';
import usePlayback from '@hooks/usePlayback';
import { PlaylistInfo, SearchlistEntry } from './PlaylistInfo';

const { colorTheme } = skinPreset;

export default function PlaylistList() {
  const { onPlayAllFromFav } = usePlayback({});
  const favoritePlaylist = useNoxSetting((state) => state.favoritePlaylist);
  const {
    playlists,
    playlistIds,
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
    onDragEnd,
  } = useFavList();

  return (
    <React.Fragment>
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
        {false && (
          <SearchlistEntry
            key2='key'
            playlist={favoritePlaylist}
            setSelectedList={setSelectedList}
            handleAddToFavClick={handleAddToFavClick}
            onPlayAllFromFav={onPlayAllFromFav}
            handleCreateAsFavClick={(v) => {
              setSongsStoredAsNewFav(v);
              setOpenNewDialog(true);
            }}
            handleDeleteFavClick={handleDeleteFavClick}
          />
        )}
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
                        <PlaylistInfo
                          key2={String(index)}
                          playlist={playlists[item]!}
                          setSelectedList={setSelectedList}
                          handleAddToFavClick={handleAddToFavClick}
                          onPlayAllFromFav={onPlayAllFromFav}
                          handleCreateAsFavClick={(v) => {
                            setSongsStoredAsNewFav(v);
                            setOpenNewDialog(true);
                          }}
                          handleDeleteFavClick={handleDeleteFavClick}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </List>
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
