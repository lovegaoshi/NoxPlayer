
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";


export default function ({ onClose, openState }) {
    const handleCancel = () => {
      onClose();
    };
  
    return (
      <div>
        <Dialog open={openState}>
          <DialogTitle>帮助</DialogTitle>
          <DialogContent>
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
          </DialogContent>
  
          <DialogActions>
            <Button onClick={handleCancel}>好的</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  