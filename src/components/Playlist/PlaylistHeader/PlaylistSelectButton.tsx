import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import DeselectIcon from '@mui/icons-material/Deselect';
import SelectAllIcon from '@mui/icons-material/SelectAll';

import { SORT_OPTIONS } from '@enums/Playlist';
import PlaylistSortButton from './PlaylistSortButton';

interface UsePlaylist {
  checking: boolean;
  setChecking: React.Dispatch<React.SetStateAction<boolean>>;
  resetSelected: () => void;
  toggleSelectedPage: () => void;
  sortPlaylist: (
    sort: SORT_OPTIONS,
    ascend: boolean,
    playlist: NoxMedia.Playlist,
  ) => void;
  playlist: NoxMedia.Playlist;
}
interface Props {
  usePlaylist: UsePlaylist;
}

export default function ({ usePlaylist }: Props) {
  const onClick = () => {
    if (usePlaylist.checking) {
      usePlaylist.resetSelected();
    }
    usePlaylist.setChecking((val) => !val);
  };
  return (
    <React.Fragment>
      {usePlaylist.checking && (
        <>
          <PlaylistSortButton
            sortPlaylist={usePlaylist.sortPlaylist}
            playlist={usePlaylist.playlist}
          />
          <Tooltip title='选择ALL'>
            <IconButton size='large' onClick={usePlaylist.toggleSelectedPage}>
              <SelectAllIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
      <Tooltip title={usePlaylist.checking ? '取消选择' : '选择'}>
        <IconButton size='large' onClick={onClick}>
          {usePlaylist.checking ? <DeselectIcon /> : <CropSquareIcon />}
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}
