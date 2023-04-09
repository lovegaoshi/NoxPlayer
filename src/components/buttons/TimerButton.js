import React, { useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { TimerDialog } from "../dialogs/TimerDialog";
import TimerIcon from '@mui/icons-material/Timer';
import Button from '@mui/material/Button';

/**
 * a component that includes a 
 * @param {Object} AddFavIcon styles of the icon used inside.
 * @param {function} onClosedDialogFunc function that is called after the dialog is closed.
 * @returns 
 */
export default function TimerButton ({ AddFavIcon, btnType = "IconButton" }) {

    const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

    const buttonType = (type) => {
        switch (type) {
            case "IconButton":
                return (
                    <Tooltip title="定时停止播放">
                        <IconButton size='large' onClick={() => setOpenSettingsDialog(true)}>
                            <TimerIcon sx={AddFavIcon} />
                        </IconButton>
                    </Tooltip>
                )
        }
        return (
            <Button startIcon={<TimerIcon/>} onClick={() => setOpenSettingsDialog(true)}>定时停止播放</Button>
        )
    }

    return (
        <React.Fragment >
            {buttonType(btnType)}
            <TimerDialog
                id='TimerDialog'
                openState={openSettingsDialog}
                onClose={() => setOpenSettingsDialog(false)}
                onTimerUp={() => document.getElementsByClassName('music-player-audio')[0].pause()}
                keepMounted
            />
        </React.Fragment >
    )
}