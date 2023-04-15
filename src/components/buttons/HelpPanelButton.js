import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Dialog from '../dialogs/HelpDialog';

/**
 * a component that includes a
 * @param {Object} AddFavIcon styles of the icon used inside.
 * @param {function} onClosedDialogFunc function that is called after the dialog is closed.
 * @returns
 */
export default function helpPanelButton({ AddFavIcon, onClosedDialogFunc = () => {} }) {
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  return (
    <React.Fragment>
      <Tooltip title="帮助">
        <IconButton size="large" onClick={() => setOpenSettingsDialog(true)}>
          <HelpOutlineIcon sx={AddFavIcon} />
        </IconButton>
      </Tooltip>
      <Dialog
        id="HelpDialog"
        openState={openSettingsDialog}
        onClose={(val) => {
          onClosedDialogFunc(val);
          setOpenSettingsDialog(false);
        }}
      />
    </React.Fragment>
  );
}
