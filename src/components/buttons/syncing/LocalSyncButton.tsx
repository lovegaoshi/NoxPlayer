/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import Tooltip from '@mui/material/Tooltip';
import { StorageManagerCtx } from '../../../contexts/StorageManagerContext';

export function ExportFavButton(AddFavIcon: Object) {
  const StorageManager = useContext(StorageManagerCtx);
  // alls sync buttons are loaded/unloaded depending on the current sync setting;
  // thus they all must have exactly the same states for react to mount and unmount to another set.
  // even though they are not used.
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dummy = enqueueSnackbar;
  const [loading, setLoading] = useState(false);
  return (
    <Tooltip title='导入歌单'>
      <IconButton size='large' onClick={() => StorageManager.importStorage()}>
        <FileUploadIcon sx={AddFavIcon} />
      </IconButton>
    </Tooltip>
  );
}

export function ImportFavButton(AddFavIcon: Object) {
  const StorageManager = useContext(StorageManagerCtx);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dummy = enqueueSnackbar;
  const [loading, setLoading] = useState(false);
  return (
    <Tooltip title='导出歌单'>
      <IconButton size='large' onClick={() => StorageManager.exportStorage()}>
        <DownloadIcon sx={AddFavIcon} />
      </IconButton>
    </Tooltip>
  );
}
