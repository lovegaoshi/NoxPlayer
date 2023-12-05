import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import RssFeedIcon from '@mui/icons-material/RssFeed';

import { useNoxSetting } from '@APM/stores/useApp';
import FavSettingsDialog from '../../dialogs/FavSettingsDialog';
import FavSettingLoading from './FavSettingLoading';

interface UsePlaylist {
  refreshing: boolean;
  refreshPlaylist: () => void;
}

interface props {
  currentList: NoxMedia.Playlist;
  usePlaylist: UsePlaylist;
}

/**
 * a component that includes a setting button; an update button; and a setting dialog.
 * this component serves in Fav.js that it opens the setting window for a playlist;
 * and update playlist according to its subscription urls.
 * @param {Object} currentList playlist object.
 * @param {function} rssUpdate function that updates the playlist's content, fetching its subscription urls.
 * @returns
 */
export default function FavSettingsButtons({
  currentList,
  usePlaylist,
}: props) {
  const { refreshing, refreshPlaylist } = usePlaylist;
  const updatePlaylist = useNoxSetting((state) => state.updatePlaylist);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  /**
   * updates the favlist object.
   * @param {object} listObj
   * @param {Array} urls
   * @param {string} favListName
   * @param {boolean} useBiliShazam
   */
  // const updateFavSetting = (listObj, {subscribeUrls = [], favListName = null, useBiliShazam = null, bannedBVids = []}) => {
  const updateFavSetting = (
    listObj: NoxMedia.Playlist,
    listSetting: { [key: string]: any } = {},
  ) => {
    updatePlaylist({
      ...listObj,
      ...listSetting,
      title: listSetting.favListName,
    });
    setOpenSettingsDialog(false);
  };

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
        onClose={updateFavSetting}
        onCancel={() => setOpenSettingsDialog(false)}
        fromList={currentList}
        rssUpdate={refreshPlaylist}
      />
    </React.Fragment>
  );
}
