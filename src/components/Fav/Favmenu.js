/* eslint-disable react/jsx-no-bind */
import React, { useContext, useCallback } from 'react';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import LinkIcon from '@mui/icons-material/Link';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import RefreshIcon from '@mui/icons-material/Refresh';
import TerminalIcon from '@mui/icons-material/Terminal';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import 'react-contexify/dist/ReactContexify.css';

import { getName } from '@APM/utils/re';
import { saveFav, readLocalStorage } from '@utils/ChromeStorage';
import { StorageManagerCtx } from '@contexts/StorageManagerContext';
import { MY_FAV_LIST_KEY } from '@objects/Storage2';
import { BiliBiliIconSVG, goToBiliBili, toBiliBili } from '../bilibiliIcon';

export const MENU_ID = 'favmenu';

export const searchSongOnWeb = (song) => {
  chrome.search.query({
    text: getName(song, true),
    disposition: 'NEW_TAB',
  });
};

export const searchSongOnBili = (song) =>
  window.open(
    `https://search.bilibili.com/all?keyword=${getName(
      song,
      true,
    )}&from_source=webtop_search`,
  );

/**
 * right-click context menu for Fav.
 * has menu items:
 * play
 * copy name to clipboard
 * go to its bilibili page
 * search song w/ the default search engine
 * search song on bilibili
 * @returns
 */

export default function App({ theme }) {
  const StorageManager = useContext(StorageManagerCtx);

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function handleItemClick({ event, props, triggerEvent, data }) {
    console.warn('method not implemented', props.song);
  }

  function copyToClipboard({ props }) {
    navigator.clipboard.writeText(getName(props.song, true));
  }

  function copyLinkToClipboard({ props }) {
    navigator.clipboard.writeText(
      toBiliBili({ bvid: props.song.bvid, episode: props.song.page }),
    );
  }

  function searchOnWeb({ props }) {
    searchSongOnWeb(props.song);
  }

  function searchInFav({ props }) {
    props.performSearch(getName(props.song, true));
  }

  function searchOnBilibili({ props }) {
    searchSongOnBili(props.song);
  }

  function banSongBVid({ event, props, triggerEvent, data }) {
    props.onDelete();
    props.currentFavList.bannedBVids.push(props.song.bvid);
    saveFav(props.currentFavList);
  }

  function reloadSongBVid({ event, props, triggerEvent, data }) {
    props.reloadBVid(props.song.bvid);
  }

  async function deleteSongFromAllLists({ props }) {
    // HACK: works but songs may not play after this. everything looked normal though??
    // TODO: any problems with favlist not updated its because favlist.js actually stores all favlists
    // in a state; storageManager context manages that state. so any direct updates to favlists through,
    // for example savFav in storage.js, wont get updated in favlist.js's state and thus appears not updated.
    props.onDelete();
    for (const favListKey of await readLocalStorage(MY_FAV_LIST_KEY)) {
      const favList = await readLocalStorage(favListKey);
      const favListLen = favList.songList.length;
      favList.songList = favList.songList.filter(
        (val) => val.id !== props.song.id,
      );
      if (favListLen !== favList.songList.length)
        await StorageManager.updateFavList(favList);
    }
  }

  function editSongBVid({ event, props, triggerEvent, data }) {
    props.onSongEdit();
  }

  function displayMenu(e) {
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    show({
      event: e,
    });
  }

  return (
    <div>
      <Menu id={MENU_ID} animation='slide' theme={theme}>
        <Item onClick={copyToClipboard}>
          <ContentCopyIcon /> &nbsp; 把歌名复制到剪贴板
        </Item>
        <Item onClick={copyLinkToClipboard}>
          <LinkIcon /> &nbsp; 把b站链接复制到剪贴板
        </Item>
        <Item
          onClick={({ props }) =>
            goToBiliBili({ bvid: props.song.bvid, episode: props.song.page })
          }
        >
          <BiliBiliIconSVG /> &nbsp; 去b站
        </Item>
        <Item onClick={searchInFav}>
          <FindInPageIcon /> &nbsp; 在歌单里搜索这首歌
        </Item>
        <Item onClick={searchOnWeb}>
          <SearchIcon /> &nbsp; 在网上搜索这首歌
        </Item>
        <Item onClick={searchOnBilibili}>
          <SearchIcon /> &nbsp; 在b站搜索这首歌
        </Item>
        <Separator />
        <Item onClick={editSongBVid}>
          <EditIcon /> &nbsp; 改歌名
        </Item>
        <Item onClick={reloadSongBVid}>
          <RefreshIcon /> &nbsp; 重新载入这首歌的bv号
        </Item>
        <Item onClick={deleteSongFromAllLists}>
          <DeleteForeverIcon /> &nbsp; 在所有歌单中删除这首歌
        </Item>
        <Item onClick={banSongBVid}>
          <NotInterestedIcon /> &nbsp; 删除并拉黑这首歌的bv号
        </Item>
        <Item onClick={handleItemClick}>
          <TerminalIcon /> &nbsp; console.log
        </Item>
      </Menu>
    </div>
  );
}

App.defaultProps = {
  theme: 'light',
};
