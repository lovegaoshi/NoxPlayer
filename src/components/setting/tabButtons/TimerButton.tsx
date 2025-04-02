import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TimerIcon from '@mui/icons-material/Timer';
import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material';

import TimerDialog from './TimerDialog';

interface Props {
  AddFavIcon: SxProps<Theme> | undefined;
  btnType: string;
}
/**
 * a component that includes a
 * @param {Object} AddFavIcon styles of the icon used inside.
 * @param {function} onClosedDialogFunc function that is called after the dialog is closed.
 * @returns
 */
export default function TimerButton({
  AddFavIcon = undefined,
  btnType = 'IconButton',
}: Props) {
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const buttonType = (type: string) => {
    switch (type) {
      case 'IconButton':
        return (
          <Tooltip title='定时停止播放'>
            <IconButton
              size='large'
              onClick={() => setOpenSettingsDialog(true)}
            >
              <TimerIcon sx={AddFavIcon} />
            </IconButton>
          </Tooltip>
        );
      default:
        return (
          <Button
            startIcon={<TimerIcon />}
            onClick={() => setOpenSettingsDialog(true)}
          >
            定时停止播放
          </Button>
        );
    }
  };

  return (
    <React.Fragment>
      {buttonType(btnType)}
      <TimerDialog
        openState={openSettingsDialog}
        onClose={() => setOpenSettingsDialog(false)}
      />
    </React.Fragment>
  );
}
