import React, { useContext, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import Tooltip from '@mui/material/Tooltip';
import { StorageManagerCtx } from '../../contexts/StorageManagerContext';

export function ExportFavButton(AddFavIcon) {
  const StorageManager = useContext(StorageManagerCtx);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  return (
    <Tooltip title="导入歌单">
      <IconButton size="large" onClick={() => StorageManager.importStorage()}>
        <FileUploadIcon sx={AddFavIcon} />
      </IconButton>
    </Tooltip>
  );
}

export function ImportFavButton(AddFavIcon) {
  const StorageManager = useContext(StorageManagerCtx);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  return (
    <Tooltip title="导出歌单">
      <IconButton size="large" onClick={() => StorageManager.exportStorage()}>
        <DownloadIcon sx={AddFavIcon} />
      </IconButton>
    </Tooltip>
  );
}
