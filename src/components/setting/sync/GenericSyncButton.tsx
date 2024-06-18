import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import { SxProps } from '@mui/material';

import { exportPlayerContent } from '@utils/ChromeStorageAPI';

interface ImportPropsR extends NoxSyncComponent.ImportProps {
  sx: SxProps;
}

interface ExportPropsR extends NoxSyncComponent.ExportProps {
  sx: SxProps;
}

interface PropsR extends NoxSyncComponent.Props {
  sx: SxProps;
}

export interface GenericPropsR extends NoxSyncComponent.GenericProps {
  sx: SxProps;
}

function ImportSyncFavButton({
  restoreFromUint8Array,
  noxRestore,
  login,
  sx,
}: ImportPropsR) {
  // @ts-ignore
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const errorHandling = (
    e: Error,
    msg = '歌单同步自云端失败，错误记录在控制台里',
  ) => {
    console.error(e);
    enqueueSnackbar(msg, {
      variant: 'error',
    });
    setLoading(false);
  };

  const cloudDownload = async () => {
    const response = await noxRestore();
    if (response !== null) {
      await restoreFromUint8Array(response);
      enqueueSnackbar('歌单同步自云端成功！', {
        variant: 'success',
        autoHideDuration: 4000,
      });
    } else {
      errorHandling(new Error('云端歌单不存在'), '云端歌单不存在');
    }
    setLoading(false);
    return response;
  };

  const loginAndDownload = async () => {
    setLoading(true);
    await login(cloudDownload, errorHandling);
  };

  return (
    <Tooltip title='下载歌单自云端'>
      <IconButton size='large' onClick={loading ? () => {} : loginAndDownload}>
        {loading ? (
          // for the love of bloody mary, why is 1em 28px here but 24px next?
          <CircularProgress sx={sx} size='24px' />
        ) : (
          <CloudDownloadIcon sx={sx} />
        )}
      </IconButton>
    </Tooltip>
  );
}

function ExportSyncFavButton({ noxBackup, login, sx }: ExportPropsR) {
  // @ts-ignore
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const errorHandling = (e: Error) => {
    console.error(e);
    enqueueSnackbar('歌单上传到云端失败，错误记录在控制台里', {
      variant: 'error',
    });
    setLoading(false);
  };

  const cloudUpload = async () => {
    const exportedDict = await exportPlayerContent();
    const response = await noxBackup(exportedDict);
    if (response.status === 200 || response.status === 201) {
      enqueueSnackbar('歌单上传到云端成功！', {
        variant: 'success',
        autoHideDuration: 4000,
      });
    } else {
      errorHandling(response);
    }
    setLoading(false);
    return response;
  };

  const loginAndUpload = async () => {
    setLoading(true);
    await login(cloudUpload, errorHandling);
  };

  return (
    <Tooltip title='上传歌单到云端'>
      <IconButton size='large' onClick={loading ? () => {} : loginAndUpload}>
        {loading ? (
          // for the love of bloody mary, why is 1em 28px here but 24px next?
          <CircularProgress sx={sx} size='24px' />
        ) : (
          <CloudUploadIcon sx={sx} />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default function GenericSyncBtn({
  restoreFromUint8Array,
  login,
  noxBackup,
  noxRestore,
  sx,
}: PropsR) {
  return (
    <React.Fragment>
      <ExportSyncFavButton login={login} noxBackup={noxBackup} sx={sx} />
      <ImportSyncFavButton
        restoreFromUint8Array={restoreFromUint8Array}
        login={login}
        noxRestore={noxRestore}
        sx={sx}
      />
    </React.Fragment>
  );
}
