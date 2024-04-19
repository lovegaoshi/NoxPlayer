import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { NewFavDialog } from '../dialogs/AddFavDialog';

interface Props {
  AddFavIcon: Object;
  onClosedDialogFunc: Function;
}
/**
 * a component that includes a
 * @param {Object} AddFavIcon styles of the icon used inside.
 * @param {function} onClosedDialogFunc function that is called after the dialog is closed.
 * @returns
 */
export default function newPlaylistButton({
  AddFavIcon,
  onClosedDialogFunc,
}: Props) {
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  return (
    <React.Fragment>
      <Tooltip title='新建歌单'>
        <IconButton size='large' onClick={() => setOpenSettingsDialog(true)}>
          <AddIcon sx={AddFavIcon} />
        </IconButton>
      </Tooltip>
      <NewFavDialog
        id={'newFavDialogID'}
        openState={openSettingsDialog}
        onClose={(val?: string) => {
          onClosedDialogFunc(val);
          setOpenSettingsDialog(false);
        }}
      />
    </React.Fragment>
  );
}
