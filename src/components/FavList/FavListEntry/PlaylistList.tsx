import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import useFavList from '@hooks/useFavList';
import usePlayer from '@hooks/usePlayer';
import { skinPreset } from '@styles/skin';
import { PlaylistEntry } from './PlaylistEntry';

const { colorTheme } = skinPreset;

export default function PlaylistList() {
  const { onPlayAllFromFav } = usePlayer({});
  const {
    playlists,
    playlistIds,
    setSelectedList,
    setSongsStoredAsNewFav,
    setOpenNewDialog,
    handleDeleteFavClick,
    handleAddToFavClick,
    onDragEnd,
  } = useFavList();

  return (
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
                    <PlaylistEntry
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
  );
}
