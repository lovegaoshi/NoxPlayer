/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import Tooltip from '@mui/material/Tooltip';
import { SxProps, Theme } from '@mui/material';

import useInitializeStore from '@stores/useInitializeStore';
import { exportPlayerContent } from '@utils/ChromeStorageAPI';
import uploadLocalFile from '@utils/uploadLocalFile';

interface SyncFavButtonProps {
  AddFavIcon: SxProps<Theme>;
}
export function ExportFavButton({ AddFavIcon }: SyncFavButtonProps) {
  const { initializeFromSync } = useInitializeStore();
  // alls sync buttons are loaded/unloaded depending on the current sync setting;
  // thus they all must have exactly the same states for react to mount and unmount to another set.
  // even though they are not used.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  return (
    <Tooltip title='导入歌单'>
      <IconButton
        size='large'
        onClick={() => importStorage(initializeFromSync)}
      >
        <FileUploadIcon sx={AddFavIcon} />
      </IconButton>
    </Tooltip>
  );
}

export function ImportFavButton({ AddFavIcon }: SyncFavButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  return (
    <Tooltip title='导出歌单'>
      <IconButton size='large' onClick={() => exportStorage()}>
        <DownloadIcon sx={AddFavIcon} />
      </IconButton>
    </Tooltip>
  );
}

const exportStorage = async () => {
  const bytes = await exportPlayerContent();
  const blobBytes = new Blob([bytes], {
    type: 'application/json;charset=utf-8',
  });
  const href = window.URL.createObjectURL(blobBytes);
  const link = document.createElement('a');
  link.href = href;
  link.download = `noxplay_${new Date().toISOString().slice(0, 10)}.noxBackup`;
  document.body.appendChild(link);
  link.click();
};

const importStorage = async (
  importStorageRaw: (val: Uint8Array) => Promise<unknown>,
) => uploadLocalFile((v) => importStorageRaw(new Uint8Array(v)));
