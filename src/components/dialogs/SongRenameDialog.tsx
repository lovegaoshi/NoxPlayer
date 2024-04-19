import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';

import getBiliUser from '@APM/utils/Bilibili/BiliUser';
import { editBiliVideo } from '@utils/Bilibili/biliEdit';

interface Props {
  openState: boolean;
  song?: NoxMedia.Song;
  onClose: () => void;
  updateSong: (song: NoxMedia.Song, v: Partial<NoxMedia.Song>) => void;
}

export default function songRenameDialog({
  openState,
  song,
  onClose,
  updateSong,
}: Props) {
  const [songBVID, setSongBVID] = useState('');
  const [songBVIndex, setSongBVIndex] = useState('');
  const [songName, setSongName] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const circularProgress = () => <CircularProgress />;

  useEffect(() => {
    if (!song) return;
    setSongBVID(song.bvid);
    setSongBVIndex(song.page ? String(song.page) : '');
    setSongName(song.parsedName);
  }, [song]);

  const handleClose = async () => {
    if (!song) return;
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
    onClose();
    switch ((await getBiliUser()).mid) {
      case 3493085134719196:
        if (song.singerId !== 3493085134719196) break;
        // eslint-disable-next-line no-case-declarations
        const key = enqueueSnackbar('正在连接歌名修订API……', {
          variant: 'info',
          persist: true,
          action: circularProgress,
        });
        try {
          const res = await editBiliVideo(
            songBVID,
            Number(songBVIndex) - 1,
            extractedSongName,
          );
          if (res?.status === 200) {
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
      case song.singerId:
        window.open(
          `https://member.bilibili.com/platform/upload/video/frame?type=edit&bvid=${song.bvid}`,
        );
        break;
      default:
    }
    updateSong(song, {
      name: extractedSongName,
      parsedName: extractedSongName,
    });
  };

  return (
    <Dialog open={openState} onClose={onClose}>
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
        <Button onClick={onClose}> 取消 </Button>
        <Button onClick={handleClose}> 好的 </Button>
      </DialogActions>
    </Dialog>
  );
}
