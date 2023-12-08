import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';

import { contextMenu } from 'react-contexify';
import { skinPreset } from '@styles/skin';
import { UsePlaylistP } from '../hooks/usePlaylistPaginated';

const { colorTheme } = skinPreset;

interface TableProps {
  children: React.ReactElement | React.ReactElement[];
  draggable?: boolean;
  onDragEnd: (result: DropResult) => void;
}
export function SongListDraggable({
  draggable = false,
  children,
  onDragEnd,
}: TableProps): React.ReactElement {
  if (draggable) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
              {children}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
  return <TableBody>{children}</TableBody>;
}

interface Props {
  song: NoxMedia.Song;
  index: number;
  playlist: NoxMedia.Playlist;
  usePlaylist: UsePlaylistP;
  openSongEditDialog: (song: NoxMedia.Song) => void;
  children: React.ReactElement;
  draggable?: boolean;
}
export function SongInfoDraggable({
  song,
  index,
  playlist,
  usePlaylist,
  openSongEditDialog,
  children,
  draggable = false,
}: Props) {
  const onContextMenu = (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => {
    event.preventDefault();
    contextMenu.show({
      id: 'favmenu',
      event,
      props: {
        song,
        performSearch: (v: string) => usePlaylist.performSearch(v, true),
        playlist,
        onSongEdit: () => openSongEditDialog(song),
      },
    });
  };

  if (draggable) {
    return (
      <Draggable
        key={`item-${index}`}
        draggableId={`item-${index}`}
        index={index}
      >
        {(provided2, snapshot2) => (
          <StyledTableRow
            ref={provided2.innerRef}
            {...provided2.draggableProps}
            {...provided2.dragHandleProps}
            style={{
              background: snapshot2.isDragging
                ? colorTheme.clickHoldBackground
                : null,
              ...provided2.draggableProps.style,
            }}
            key={`${song.id}-${index}`}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            onContextMenu={onContextMenu}
          >
            {children}
          </StyledTableRow>
        )}
      </Draggable>
    );
  }

  return (
    <StyledTableRow
      key={`${song.id}-${index}`}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      onContextMenu={onContextMenu}
    >
      {children}
    </StyledTableRow>
  );
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: colorTheme.FavAlternateBackgroundColor, // theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
