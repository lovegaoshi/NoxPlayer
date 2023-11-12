import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';

import { getBiliUser } from '@utils/PersonalCloudAuth';
import { getPlayerSettingKey } from '@utils/ChromeStorage';
import Song from '@objects/SongInterface';

interface props {
  openState: boolean;
  songObj: Song;
  onClose: Function;
  saveList: Function;
}

export default function songRenameDialog({
  openState,
  songObj,
  onClose,
  saveList,
}: props) {
  const [songBVID, setSongBVID] = useState('');
  const [songBVIndex, setSongBVIndex] = useState('');
  const [songName, setSongName] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const circularProgress = () => <CircularProgress />;

  useEffect(() => {
    setSongBVID(songObj.bvid);
    setSongBVIndex(songObj.page ? String(songObj.page) : '');
    setSongName(songObj.parsedName);
  }, [songObj]);

  const handleClose = async () => {
    // 歌曲名：卡宝殿下，歌手名：甜儿，专辑名：
    const regExtractQQMusicName = (name: string) => {
      const extractedName = /歌曲名：(.+)，歌手名/.exec(name);
      if (extractedName) {
        setSongName(extractedName[1]!);
        return extractedName[1]!;
      }
      return name;
    };
    const extractedSongName = regExtractQQMusicName(songName);
    const result = { songBVID, songBVIndex, extractedSongName };
    songObj.name = extractedSongName;
    songObj.parsedName = extractedSongName;
    onClose(result);
    switch ((await getBiliUser()).mid) {
      case 3493085134719196:
        if (songObj.singerId !== 3493085134719196) break;
        // eslint-disable-next-line no-case-declarations
        const key = enqueueSnackbar('正在连接歌名修订API……', {
          variant: 'info',
          persist: true,
          action: circularProgress,
        });
        try {
          const res = await fetch(
            `${await getPlayerSettingKey(
              'personalCloudIP',
            )}noxtagfix?bvid=${songBVID}&index=${songBVIndex}&name=${extractedSongName}&secret=${
              process.env.PERSONAL_CLOUD_SECRET
            }`,
          );
          if (res.status === 200) {
            closeSnackbar(key);
            enqueueSnackbar('歌名修订API连接成功', { variant: 'success' });
          } else {
            console.error(res);
            throw new Error(
              'connect to song rename API failed; res status is not 200',
            );
          }
        } catch (e) {
          closeSnackbar(key);
          console.error(e);
          enqueueSnackbar('歌名修订API连接失败', { variant: 'error' });
        }
        break;
      case songObj.singerId:
        window.open(
          `https://member.bilibili.com/platform/upload/video/frame?type=edit&bvid=${songObj.bvid}`,
        );
        break;
      default:
    }
    saveList();
  };

  return (
    <Dialog open={openState}>
      <DialogTitle>更改歌名</DialogTitle>
      <DialogContent>
        <TextField
          margin='dense'
          id='BVID'
          label='BVID'
          type='text'
          variant='standard'
          style={{ maxWidth: '11em' }}
          onChange={(e) => setSongBVID(e.target.value)}
          value={songBVID}
          autoComplete='off'
        />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <TextField
          margin='dense'
          id='index'
          label='index'
          type='text'
          variant='standard'
          style={{ maxWidth: '3em' }}
          onChange={(e) => setSongBVIndex(e.target.value)}
          value={songBVIndex}
          autoComplete='off'
        />
        <br />
        <TextField
          autoFocus
          margin='dense'
          id='name'
          label='new name'
          type='text'
          variant='standard'
          onChange={(e) => setSongName(e.target.value)}
          value={songName}
          autoComplete='off'
          onKeyDown={(e) => {
            if (e.code === 'Enter') handleClose();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}> 取消 </Button>
        <Button onClick={handleClose}> 好的 </Button>
      </DialogActions>
    </Dialog>
  );
}
