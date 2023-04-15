import React, { useContext, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import { noxBackup, noxRestore, loginDropbox } from '../../../utils/dropboxauth';
import { StorageManagerCtx } from '../../../contexts/StorageManagerContext';

export function ImportSyncFavButton(AddFavIcon) {
  const StorageManager = useContext(StorageManagerCtx);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const errorHandling = (e, msg = '歌单同步自Dropbox失败，错误记录在控制台里') => {
    console.error(e);
    enqueueSnackbar(msg, {
      variant: 'error',
    });
    setLoading(false);
  };

  const cloudDownload = async () => {
    const response = await noxRestore();
    if (response !== null) {
      await StorageManager.importStorageRaw(response);
      enqueueSnackbar('歌单同步自Dropbox成功！', { variant: 'success', autoHideDuration: 4000 });
    } else {
      errorHandling('云端歌单不存在', '云端歌单不存在');
    }
    setLoading(false);
    return response;
  };

  const loginAndDownload = async () => {
    setLoading(true);
    await loginDropbox(cloudDownload, errorHandling);
  };

  return (
    <Tooltip title="下载歌单自Dropbox">
      <IconButton size="large" onClick={loading ? () => {} : loginAndDownload}>
        { loading
        // for the love of bloody mary, why is 1em 28px here but 24px next?
          ? <CircularProgress sx={AddFavIcon} size="24px" />
          : <CloudDownloadIcon sx={AddFavIcon} />}
      </IconButton>
    </Tooltip>
  );
}

export function ExportSyncFavButton(AddFavIcon) {
  const StorageManager = useContext(StorageManagerCtx);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const errorHandling = (e) => {
    console.error(e);
    enqueueSnackbar('歌单上传到Dropbox失败，错误记录在控制台里', {
      variant: 'error',
    });
    setLoading(false);
  };

  const cloudUpload = async () => {
    const exportedDict = await StorageManager.exportStorageRaw();
    const response = await noxBackup(exportedDict);
    if (response.status === 200) {
      enqueueSnackbar('歌单上传到Dropbox成功！', { variant: 'success', autoHideDuration: 4000 });
    } else {
      errorHandling(response);
    }
    setLoading(false);
    return response;
  };

  const loginAndUpload = async () => {
    setLoading(true);
    await loginDropbox(cloudUpload, errorHandling);
  };

  return (
    <Tooltip title="上传歌单到Dropbox">
      <IconButton size="large" onClick={loading ? () => {} : loginAndUpload}>
        { loading
        // for the love of bloody mary, why is 1em 28px here but 24px next?
          ? <CircularProgress sx={AddFavIcon} size="24px" />
          : <CloudUploadIcon sx={AddFavIcon} />}
      </IconButton>
    </Tooltip>
  );
}
