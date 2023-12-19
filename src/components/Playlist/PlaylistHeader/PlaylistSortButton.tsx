import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import { SORT_OPTIONS } from '@enums/Playlist';

interface Props {
  sortPlaylist: (sort: SORT_OPTIONS, playlist: NoxMedia.Playlist) => void;
  playlist: NoxMedia.Playlist;
}

interface DialogProps extends Props {
  openState: boolean;
  onClose: () => void;
}

function PlaylistSortDialog({
  openState,
  onClose,
  playlist,
  sortPlaylist,
}: DialogProps) {
  const [sortOption, setSortOption] = React.useState(
    SORT_OPTIONS.PREVIOUS_ORDER,
  );
  const handleSort = () => {
    onClose();
    sortPlaylist(sortOption, playlist);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption((event.target as HTMLInputElement).value as SORT_OPTIONS);
  };

  React.useEffect(() => {
    setSortOption(playlist.sort ?? SORT_OPTIONS.PREVIOUS_ORDER);
  }, [playlist]);

  return (
    <Dialog open={openState} onClose={onClose}>
      <DialogTitle>{`SORT歌单 ${playlist.title} by:`}</DialogTitle>
      <DialogContent>
        <FormControl>
          <RadioGroup
            aria-labelledby='demo-controlled-radio-buttons-group'
            name='controlled-radio-buttons-group'
            value={sortOption}
            onChange={handleChange}
          >
            {Object.entries(SORT_OPTIONS).map(([key, value]) => (
              <FormControlLabel
                value={value}
                control={<Radio />}
                label={value}
                key={key}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSort}>确认</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ({ sortPlaylist, playlist }: Props) {
  const [showDialog, setShowDialog] = React.useState(false);

  return (
    <React.Fragment>
      <Tooltip title='SORT'>
        <IconButton size='large' onClick={() => setShowDialog(true)}>
          <SwapVertIcon />
        </IconButton>
      </Tooltip>
      <PlaylistSortDialog
        openState={showDialog}
        onClose={() => setShowDialog(false)}
        sortPlaylist={sortPlaylist}
        playlist={playlist}
      />
    </React.Fragment>
  );
}
