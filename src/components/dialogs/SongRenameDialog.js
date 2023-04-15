import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import { getBiliUser } from '../../utils/personalCloudAuth';
import { getPlayerSettingKey } from '../../utils/ChromeStorage';

export default function songRenameDialog({
  openState, songObj, onClose, saveList,
}) {
  const [songBVID, setSongBVID] = useState('');
  const [songBVIndex, setSongBVIndex] = useState('');
  const [songName, setSongName] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const circularProgress = () => (<CircularProgress />);

  useEffect(() => {
    setSongBVID(songObj.bvid);
    setSongBVIndex(songObj.page);
    setSongName(songObj.parsedName);
  }, [songObj]);

  const handleClose = async () => {
    const result = { songBVID, songBVIndex, songName };
    songObj.name = songName;
    songObj.parsedName = songName;
    onClose(result);
    switch ((await getBiliUser()).mid) {
      case 3493085134719196:
        if (songObj.singerId !== 3493085134719196) break;
        // eslint-disable-next-line no-case-declarations
        const key = enqueueSnackbar(
          '正在连接歌名修订API……',
          { variant: 'info', persist: true, action: circularProgress },
        );
        try {
          const res = await fetch(
            `${await getPlayerSettingKey('personalCloudIP')
            }noxtagfix?bvid=${songBVID}&index=${songBVIndex}&name=${songName}&secret=${process.env.PERSONAL_CLOUD_SECRET}`,
          );
          if (res.status === 200) {
            closeSnackbar(key);
            enqueueSnackbar('歌名修订API连接成功', { variant: 'success' });
          } else {
            throw new Error(res);
          }
        } catch (e) {
          closeSnackbar(key);
          console.error(e);
          enqueueSnackbar('歌名修订API连接失败', { variant: 'error' });
        }
        break;
      case songObj.singerId:
        window.open(`https://member.bilibili.com/platform/upload/video/frame?type=edit&bvid=${songObj.bvid}`);
        break;
      default:
    }
    saveList();
  };

  return (
    <Dialog open={openState}>
      <DialogTitle>
        更改歌名
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="BVID"
          type="name"
          variant="standard"
          style={{ maxWidth: '11em' }}
          onChange={(e) => setSongBVID(e.target.value)}
          value={songBVID}
          autoComplete="off"
        />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="index"
          type="name"
          variant="standard"
          style={{ maxWidth: '3em' }}
          onChange={(e) => setSongBVIndex(e.target.value)}
          value={songBVIndex}
          autoComplete="off"
        />
        <br />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="new name"
          type="name"
          variant="standard"
          onChange={(e) => setSongName(e.target.value)}
          value={songName}
          autoComplete="off"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}> 取消 </Button>
        <Button onClick={handleClose}> 好的 </Button>
      </DialogActions>
    </Dialog>
  );
}
