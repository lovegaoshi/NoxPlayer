import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import RssFeedIcon from '@mui/icons-material/RssFeed';

import FavSettingsDialog from './PlaylistSettingsDialog';
import FavSettingLoading from './PlaylistSettingsLoading';

interface UsePlaylist {
  refreshing: boolean;
  refreshPlaylist: (v?: string[]) => void;
}

interface Props {
  playlist: NoxMedia.Playlist;
  usePlaylist: UsePlaylist;
}

/**
 * a component that includes a setting button; an update button; and a setting dialog.
 * this component serves in Fav.js that it opens the setting window for a playlist;
 * and update playlist according to its subscription urls.
 * @param {Object} playlist playlist object.
 * @param {function} rssUpdate function that updates the playlist's content, fetching its subscription urls.
 * @returns
 */
export default function FavSettingsButtons({ playlist, usePlaylist }: Props) {
  const { refreshing, refreshPlaylist } = usePlaylist;
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  return (
    <React.Fragment>
      <Tooltip title='歌单设置'>
        <IconButton size='large' onClick={() => setOpenSettingsDialog(true)}>
          <RssFeedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='歌单更新'>
        <IconButton
          size='large'
          onClick={() => refreshPlaylist()}
          disabled={false}
        >
          <FavSettingLoading loading={refreshing} />
        </IconButton>
      </Tooltip>
      <FavSettingsDialog
        id='FavSettingsDialog'
        openState={openSettingsDialog}
        onClose={() => setOpenSettingsDialog(false)}
        onCancel={() => setOpenSettingsDialog(false)}
        playlist={playlist}
        rssUpdate={refreshPlaylist}
      />
    </React.Fragment>
  );
}
