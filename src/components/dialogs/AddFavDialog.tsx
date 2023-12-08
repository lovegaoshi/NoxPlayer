import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import { useNoxSetting } from '@APM/stores/useApp';

interface Props {
  id: string;
  onClose: (val?: string) => void;
  openState: boolean;
}
export const NewFavDialog = function NewFavDialog({
  onClose,
  openState,
  id,
}: Props) {
  const [favName, setfavName] = useState('');

  const handleCancel = () => {
    onClose();
    setfavName('');
  };

  const onfavName = (e: any) => {
    setfavName(e.target.value);
  };

  const handleOK = () => {
    onClose(favName);
    setfavName('');
  };

  return (
    <div>
      <Dialog open={openState} id={id}>
        <DialogTitle>新建歌单</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='歌单名字'
            type='name'
            variant='standard'
            onChange={onfavName}
            value={favName}
            autoComplete='off'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          {favName === '' ? (
            <Button disabled>确认</Button>
          ) : (
            <Button onClick={handleOK}>确认</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

interface AddFavDialogProps {
  id: string;
  onClose: (
    songs?: NoxMedia.Song[],
    toId?: string,
    fromList?: NoxMedia.Playlist,
  ) => void;
  openState: boolean;
  fromList?: NoxMedia.Playlist;
  getSongs?: () => NoxMedia.Song[] | undefined;
  isMobile?: boolean;
}
export const AddFavDialog = function AddFavDialog({
  onClose,
  openState,
  fromList,
  getSongs = () => undefined,
  isMobile = false,
  id,
}: AddFavDialogProps) {
  const [favId, setfavId] = useState('');
  const playlists = useNoxSetting((state) => state.playlists);
  const playlistIds = useNoxSetting((state) => state.playlistIds);

  const handleCancel = () => {
    onClose();
    setfavId('');
  };

  const onfavId = (e: any) => {
    setfavId(e.target.value);
  };

  const handleOK = () => {
    onClose(getSongs(), favId, fromList);
    setfavId('');
  };

  const playlistTitle = () => {
    const songs = getSongs();
    if (songs === undefined || songs.length === 0 || songs[0] === undefined) {
      return fromList === undefined ? 'BUG!' : `歌单 ${fromList.title}`;
    }
    if (songs.length > 1) {
      return `选定的歌`;
    }
    return songs[0]!.parsedName;
  };

  return (
    <div>
      <Dialog open={openState} id={id}>
        <DialogTitle>{`添加 ${playlistTitle()} 到歌单`}</DialogTitle>
        <DialogContent style={{ paddingTop: '24px' }}>
          <Box sx={{ minWidth: isMobile ? '50vw' : 400, minHeight: 50 }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>添加到歌单</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={favId}
                label='FavLists'
                onChange={onfavId}
                input={<Input />}
                MenuProps={{ PaperProps: { sx: { maxHeight: '40vh' } } }}
              >
                {playlistIds.map((v, i) => {
                  const playlist = playlists[v];
                  if (v !== fromList?.id && playlist !== undefined) {
                    return (
                      // this is stupid, stupid linter
                      // eslint-disable-next-line react/no-array-index-key
                      <MenuItem key={`menu${i}`} value={v}>
                        {playlist.title}
                      </MenuItem>
                    );
                  }
                  return null;
                })}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          {favId === '' ? (
            <Button disabled>确认</Button>
          ) : (
            <Button onClick={handleOK}>确认</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
