import React, { useState, useContext } from "react";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { SettingsDialog } from "../dialogs/PlayerSettingsDialog";
import SettingsIcon from '@mui/icons-material/Settings';
import StorageManagerCtx from '../../popup/App';

export default function PlayerSettingsButton({ AddFavIcon }) {

    const [openSettingsDialog, setOpenSettingsDialog] = useState(false)
    const StorageManager = useContext(StorageManagerCtx)

    return (
        <React.Fragment >
            <Tooltip title="播放器设置">
                <IconButton size='large' onClick={() => setOpenSettingsDialog(true)}>
                    <SettingsIcon sx={AddFavIcon} />
                </IconButton>
            </Tooltip>
            <SettingsDialog
                id='settingsDialog'
                openState={openSettingsDialog}
                onClose={(settings) => {
                    if (settings) StorageManager.setPlayerSetting(settings);
                    setOpenSettingsDialog(false);
                }}
                settings={StorageManager.getPlayerSetting()}
            />
        </React.Fragment >
    )
}