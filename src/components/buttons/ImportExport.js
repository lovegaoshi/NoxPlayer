import React, { useContext } from "react";
import StorageManagerCtx from '../../popup/App';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export const ExportFavButton = (AddFavIcon) => {
    const StorageManager = useContext(StorageManagerCtx);
    return (
        <Tooltip title="导入云端歌单">
            <IconButton size='large' onClick={() => StorageManager.importStorage()}>
                <FileUploadIcon sx={AddFavIcon} />
            </IconButton>
        </Tooltip>
    )
}

export const ImportFavButton = (AddFavIcon) => {
    const StorageManager = useContext(StorageManagerCtx);
    return (
        <Tooltip title="上传云端歌单">
            <IconButton size='large' onClick={() => StorageManager.exportStorage()} >
                <DownloadIcon sx={AddFavIcon} />
            </IconButton>
        </Tooltip>
    )
}