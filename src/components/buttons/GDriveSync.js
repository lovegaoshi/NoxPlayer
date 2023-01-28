import React, { useContext } from "react";
import StorageManagerCtx from '../../popup/App';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
// import { noxBackup, noxRestore } from "../../utils/gdriveauth";

export const ExportSyncFavButton = (AddFavIcon) => {
    const StorageManager = useContext(StorageManagerCtx);
    return (
        <Tooltip title="导入歌单">
            <IconButton size='large' onClick={() => StorageManager.importStorage()}>
                <CloudUploadIcon sx={AddFavIcon} />
            </IconButton>
        </Tooltip>
    )
}

export const ImportSyncFavButton = (AddFavIcon) => {
    const StorageManager = useContext(StorageManagerCtx);
    const cloudUpload = async () => {
        let exportedDict = await StorageManager.exportStorageRaw();
        let backupResult = await noxBackup(exportedDict);
        console.debug(backupResult);
        return backupResult;
    }
    return (
        <Tooltip title="导出歌单">
            <IconButton size='large' onClick={() => cloudUpload()} >
                <CloudDownloadIcon sx={AddFavIcon} />
            </IconButton>
        </Tooltip>
    )
}