/* eslint-disable */
import React from 'react';
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
import usePlaylistCRUD from '@APM/hooks/usePlaylistCRUD';
import { SearchRegex } from '@APM/enums/Playlist';
import { BiliBiliIconSVG, goToBiliBili } from '../bilibiliIcon';
import {
  searchSongOnWeb,
  searchSongOnBili,
  copyToClipboard,
  copyLinkToClipboard,
} from './SongCRUD';

export const MENU_ID = 'favmenu';

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

export default function App({ theme = 'light' }) {
  const playlistCRUD = usePlaylistCRUD();

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function handleItemClick({ event, props, triggerEvent, data }) {
    console.warn('method not implemented', props.song);
  }

  function searchOnWeb({ props }) {
    searchSongOnWeb(props.song);
  }

  function searchInFav({ props }) {
    props.performSearch(
      `${SearchRegex.absoluteMatch.text}${getName(props.song, true)}`,
    );
  }

  function searchOnBilibili({ props }) {
    searchSongOnBili(props.song);
  }

  function banSongBVid({ event, props, triggerEvent, data }) {
    playlistCRUD.removeSongs([props.song], true, props.playlist);
  }

  function reloadSongBVid({ event, props, triggerEvent, data }) {
    playlistCRUD.reloadBVid([props.song], props.playlist);
  }

  async function deleteSongFromAllLists({ props }) {
    playlistCRUD.removeSongsFromAllLists([props.song]);
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
        <Item onClick={({ props }) => copyToClipboard(props.song)}>
          <ContentCopyIcon /> &nbsp; 把歌名复制到剪贴板
        </Item>
        <Item onClick={({ props }) => copyLinkToClipboard(props.song)}>
          <LinkIcon /> &nbsp; 把b站链接复制到剪贴板
        </Item>
        <Item onClick={({ props }) => goToBiliBili(props.song)}>
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
