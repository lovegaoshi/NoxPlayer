
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import ForumIcon from '@mui/icons-material/Forum';
import InfoIcon from '@mui/icons-material/Info';
import { textToDialogContent } from './genericDialog';

export default function ({ onClose, openState }) {
    const handleCancel = () => {
      onClose();
    };
  
    return (
      <div>
        <Dialog open={openState}>
          <DialogTitle>帮助</DialogTitle>
          <DialogContent sx={{ maxWidth: '50vw' }}>
            <DialogContentText id='alert-dialog-description'>
              搜索目前支持以下四种:
            </DialogContentText>
            <DialogContentText>
              - BVID: 视频的BVID(ex.BV1wr4y1v7TA)
            </DialogContentText>
            <DialogContentText>
              - FIV: 收藏夹的ID,需开放(ex.1793186881)
            </DialogContentText>
            <DialogContentText>
              - Collection:合集,需整个url放入搜索框(ex.https://space.bilibili.com/1982780/channel/collectiondetail?sid=93172)
            </DialogContentText>
            <DialogContentText>
              - Series:合集,需整个url放入搜索框(https://space.bilibili.com/5053504/channel/seriesdetail?sid=2440602)
            </DialogContentText>
            <p></p>
            <Button startIcon={<EmailIcon />} onClick={() => window.open('https://message.bilibili.com/?spm_id_from=333.999.0.0#whisper/mid1989881')}>有问题？B站私信</Button><div/>
            <Button startIcon={<GitHubIcon />} onClick={() => window.open('https://github.com/lovegaoshi/azusa-player/wiki')}>电闹播放器@Github</Button><div/>
            <Button startIcon={<ForumIcon />} onClick={() => window.open('https://bbs.nga.cn/read.php?tid=31176308')}>来p综@nga听歌吹水</Button><div/>
            <Button startIcon={<InfoIcon />} onClick={() => console.warn('method not implemented')}>更新说明</Button><div/>
          </DialogContent>
  
          <DialogActions>
            <Button onClick={handleCancel}>好的</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  