import React from 'react';
import List from '@mui/material/List';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { useNoxSetting } from '@APM/stores/useApp';
import { AddFavDialog, NewFavDialog } from '@components/dialogs/AddFavDialog';
import useApp from '@stores/useApp';
import usePlayback from '@hooks/usePlayback';
import { PlaylistInfo, SearchlistEntry } from './PlaylistInfo';

interface PlaylistCRUD {
  playlists: { [key: string]: NoxMedia.Playlist };
  playlistIds: string[];
  searchList: NoxMedia.Playlist;
  setSongsStoredAsNewFav: (v: NoxMedia.Song[]) => void;
  openNewDialog: boolean;
  setOpenNewDialog: (v: boolean) => void;
  openAddDialog: boolean;
  actionFavId?: NoxMedia.Playlist;
  actionFavSong?: NoxMedia.Song;

  onNewFav: (v?: string) => void;
  handleDeleteFavClick: (playlist: NoxMedia.Playlist) => void;
  handleAddToFavClick: (
    playlist: NoxMedia.Playlist,
    song?: NoxMedia.Song,
  ) => void;
  onAddFav: (
    songs?: NoxMedia.Song[],
    toId?: string,
    fromList?: NoxMedia.Playlist,
  ) => void;
  onDragEnd: (result: DropResult) => void;
}

interface Props {
  playlistCRUD: PlaylistCRUD;
}
export default function PlaylistList({ playlistCRUD }: Props) {
  const { colorTheme, ScrollBar } = useApp((state) => state.playerStyle);
  const { onPlayAllFromFav } = usePlayback();
  const favoritePlaylist = useNoxSetting((state) => state.favoritePlaylist);

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = useNoxSetting((state) => state.playlistShouldReRender);
  const {
    playlists,
    playlistIds,
    searchList,
    setSongsStoredAsNewFav,
    openNewDialog,
    setOpenNewDialog,
    openAddDialog,
    actionFavId,

    onNewFav,
    handleDeleteFavClick,
    handleAddToFavClick,
    onAddFav,
    onDragEnd,
  } = playlistCRUD;

  const handleCreateAsFavClick = (v: NoxMedia.Song[]) => {
    setSongsStoredAsNewFav(v);
    setOpenNewDialog(true);
  };

  return (
    <React.Fragment>
      <List
        style={{ overflow: 'auto', maxHeight: 'calc(100% - 50px)' }}
        className={ScrollBar().root}
        sx={{ width: '100%' }}
        component='nav'
      >
        <SearchlistEntry
          playlist={searchList}
          handleAddToFavClick={handleAddToFavClick}
          onPlayAllFromFav={onPlayAllFromFav}
          handleCreateAsFavClick={handleCreateAsFavClick}
          handleDeleteFavClick={handleDeleteFavClick}
        />
        {false && (
          <SearchlistEntry
            playlist={favoritePlaylist}
            handleAddToFavClick={handleAddToFavClick}
            onPlayAllFromFav={onPlayAllFromFav}
            handleCreateAsFavClick={handleCreateAsFavClick}
            handleDeleteFavClick={handleDeleteFavClick}
          />
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided) => (
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
                          playlist={playlists[item]!}
                          handleAddToFavClick={handleAddToFavClick}
                          onPlayAllFromFav={onPlayAllFromFav}
                          handleCreateAsFavClick={handleCreateAsFavClick}
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
        // MenuProps={{ style: { maxHeight: 200 } }}
      />
    </React.Fragment>
  );
}
