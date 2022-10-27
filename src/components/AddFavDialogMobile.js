import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

export const AddFavDialog = function ({ onClose, openState, fromId, favLists, song }) {
  const [favId, setfavId] = useState('')

  const handleCancel = () => {
    onClose()
    setfavId('')
  }

  const onfavId = (e) => {
    setfavId(e.target.value)
  }

  const handleOK = () => {
    onClose(fromId, favId, song)
    setfavId('')
  }

  return (
    <div>
      <Dialog open={openState}>
        <DialogTitle>添加到歌单</DialogTitle>
        <DialogContent style={{ paddingTop: '24px' }}>
          <Box sx={{ minWidth: '50vw', minHeight: 50 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">添加到歌单</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={favId}
                label="FavLists"
                onChange={onfavId}
              >
                {favLists && favLists.map((v, i) => {
                  if (v.id != fromId)
                    return (<MenuItem key={i} value={v.id}>{v.title}</MenuItem>)
                })}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          {favId == '' ?
            <Button disabled>确认</Button> :
            <Button onClick={handleOK}>确认</Button>}

        </DialogActions>
      </Dialog>
    </div>
  );
}
