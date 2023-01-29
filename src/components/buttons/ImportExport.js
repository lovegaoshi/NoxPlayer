import React, { useContext, useState } from "react";
import StorageManagerCtx from '../../popup/App';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import Tooltip from '@mui/material/Tooltip';

export const ExportFavButton = (AddFavIcon) => {
    const StorageManager = useContext(StorageManagerCtx);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    return (
        <Tooltip title="导入歌单">
            <IconButton size='large' onClick={() => StorageManager.importStorage()}>
                <FileUploadIcon sx={AddFavIcon} />
            </IconButton>
        </Tooltip>
    )
}

export const ImportFavButton = (AddFavIcon) => {
    const StorageManager = useContext(StorageManagerCtx);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    return (
        <Tooltip title="导出歌单">
            <IconButton size='large' onClick={() => StorageManager.exportStorage()} >
                <DownloadIcon sx={AddFavIcon} />
            </IconButton>
        </Tooltip>
    )
}