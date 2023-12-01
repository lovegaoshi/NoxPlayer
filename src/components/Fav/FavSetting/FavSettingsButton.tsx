import React, { useState, useContext, useRef, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import RssFeedIcon from '@mui/icons-material/RssFeed';

import { useNoxSetting } from '@APM/stores/useApp';
import { syncFavlist } from '@utils/Bilibili/bilifavOperate';
import {
  getPlayerSettingKey,
  readLocalStorage,
  setLocalStorage,
} from '@utils/ChromeStorage';
import { STORAGE_KEYS } from '@enums/Storage';
import FavSettingsDialog from '../../dialogs/FavSettingsDialog';
import FavSettingLoading from './FavSettingLoading';

interface props {
  currentList: NoxMedia.Playlist;
  rssUpdate: Function;
}

/**
 * a component that includes a setting button; an update button; and a setting dialog.
 * this component serves in Fav.js that it opens the setting window for a playlist;
 * and update playlist according to its subscription urls.
 * @param {Object} currentList playlist object.
 * @param {function} rssUpdate function that updates the playlist's content, fetching its subscription urls.
 * @returns
 */
export default function FavSettingsButtons({ currentList, rssUpdate }: props) {
  const updatePlaylist = useNoxSetting((state) => state.updatePlaylist);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [Loading, setLoading] = useState(false);
  const favListAutoUpdateTimestamps = useRef({} as { [key: string]: string });

  // because in mobile view, fav gets destoryed when music is playing due to its UI layout;
  // favListAutoUpdateTimestamps is not persisted. thus a dict stored in chrome.storage.local
  // is mounted here. this has the additional benefit now that i dont have to see playlists
  // get auto updated every time i reload the page because its now persisted through sessions
  useEffect(() => {
    readLocalStorage(STORAGE_KEYS.FAVLIST_AUTO_UPDATE_TIMESTAMP).then((val) => {
      if (val === undefined) return;
      favListAutoUpdateTimestamps.current = val;
    });
  }, []);

  useEffect(() => {
    const checkFavListAutoUpdate = async (
      favList: NoxMedia.Playlist,
      updateInterval = 1000 * 60 * 60 * 24,
    ) => {
      if (
        favList.id.includes('Search') ||
        !(await getPlayerSettingKey('autoRSSUpdate'))
      )
        return false;
      console.debug(
        favList.title,
        'previous updated timestamp is:',
        favListAutoUpdateTimestamps.current[favList.id],
      );
      if (favList.biliSync) {
        syncFavlist(favList);
      }
      if (
        favListAutoUpdateTimestamps.current[favList.id] === undefined ||
        Date.now() -
          new Date(favListAutoUpdateTimestamps.current[favList.id]!).getTime() >
          updateInterval
      ) {
        favListAutoUpdateTimestamps.current[favList.id] =
          new Date().toISOString();
        setLocalStorage(
          STORAGE_KEYS.FAVLIST_AUTO_UPDATE_TIMESTAMP,
          favListAutoUpdateTimestamps.current,
        );
        return true;
      }
      return false;
    };

    if (!currentList) {
      return;
    }
    checkFavListAutoUpdate(currentList).then((val) => {
      if (val) {
        setLoading(true);
        try {
          rssUpdate();
        } finally {
          setLoading(false);
        }
      }
    });
  }, [currentList]);

  /**
   * a wrapper for rssUpdate, with setting the loading state true before starting
   * and setting to false after finishing.
   * @param {Array} subscribeUrls
   */
  const handleRssUpdate = (
    subscribeUrls: Array<string> | undefined = undefined,
  ) => {
    setLoading(true);
    rssUpdate(subscribeUrls)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

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
          onClick={() => handleRssUpdate()}
          disabled={false}
        >
          <FavSettingLoading loading={Loading} />
        </IconButton>
      </Tooltip>
      <FavSettingsDialog
        id='FavSettingsDialog'
        openState={openSettingsDialog}
        onClose={updateFavSetting}
        onCancel={() => setOpenSettingsDialog(false)}
        fromList={currentList}
        rssUpdate={handleRssUpdate}
      />
    </React.Fragment>
  );
}
