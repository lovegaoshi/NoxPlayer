import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { SxProps } from '@mui/material';
import Dialog from './HelpDialog';

interface Props {
  sx: SxProps;
  onClosedDialogFunc?: Function;
}

export default function helpPanelButton({
  sx,
  onClosedDialogFunc = () => {},
}: Props) {
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  return (
    <React.Fragment>
      <Tooltip title='帮助'>
        <IconButton size='large' onClick={() => setOpenSettingsDialog(true)}>
          <HelpOutlineIcon sx={sx} />
        </IconButton>
      </Tooltip>
      <Dialog
        id='HelpDialog'
        openState={openSettingsDialog}
        onClose={() => {
          onClosedDialogFunc();
          setOpenSettingsDialog(false);
        }}
      />
    </React.Fragment>
  );
}
