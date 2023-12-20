import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import GenericSelectDialog from '@components/dialogs/GenericSelectDialog';
import { useNoxSetting } from '@APM/stores/useApp';

interface NewFavDialogProps {
  id: string;
  onClose: (val?: string) => void;
  openState: boolean;
}
export const NewFavDialog = function NewFavDialog({
  onClose,
  openState,
  id,
}: NewFavDialogProps) {
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
      <Dialog open={openState} id={id} onClose={handleCancel}>
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
}: AddFavDialogProps) {
  const playlists = useNoxSetting((state) => state.playlists);
  const playlistIds = useNoxSetting((state) => state.playlistIds);

  const handleOK = (toId: string) => {
    onClose(getSongs(), toId, fromList);
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
    <GenericSelectDialog
      visible={openState}
      options={playlistIds.filter(
        (v) => v !== fromList?.id && playlists[v] !== undefined,
      )}
      title={`添加 ${playlistTitle()} 到歌单`}
      selectTitle='SEND TO 歌单'
      renderOptionTitle={(id) => playlists[id]!.title}
      onClose={() => onClose()}
      onSubmit={handleOK}
    />
  );
};
