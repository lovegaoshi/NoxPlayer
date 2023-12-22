import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';

import GenericSelectDialog from '@components/dialogs/GenericSelectDialog';
import { SORT_OPTIONS } from '@enums/Playlist';

interface Props {
  sortPlaylist: (
    sort: SORT_OPTIONS,
    ascend: boolean,
    playlist: NoxMedia.Playlist,
  ) => void;
  playlist: NoxMedia.Playlist;
}

export default function ({ sortPlaylist, playlist }: Props) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [ascending, setAscending] = React.useState(false);
  const sortOptions = Object.values(SORT_OPTIONS);

  const handleSort = (sortOption: SORT_OPTIONS) => {
    sortPlaylist(sortOption, ascending, playlist);
  };

  return (
    <React.Fragment>
      <Tooltip title='SORT'>
        <IconButton size='large' onClick={() => setShowDialog(true)}>
          <SwapVertIcon />
        </IconButton>
      </Tooltip>
      <GenericSelectDialog
        visible={showDialog}
        options={sortOptions}
        selectTitle='SORT歌单'
        title={`SORT歌单 ${playlist.title} by:`}
        defaultIndex={playlist.sort}
        onClose={() => setShowDialog(false)}
        onSubmit={handleSort}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={ascending}
                onChange={() => setAscending((v) => !v)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label='升序?'
          />
        </FormGroup>
      </GenericSelectDialog>
    </React.Fragment>
  );
}
