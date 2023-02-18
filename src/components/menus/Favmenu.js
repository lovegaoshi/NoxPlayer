import React from 'react';
import {
    Menu,
    Item,
    Separator,
    useContextMenu
  } from "react-contexify";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import LinkIcon from '@mui/icons-material/Link';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { BiliBiliIconSVG, goToBiliBili, toBiliBili } from '../bilibiliIcon'; 
import TerminalIcon from '@mui/icons-material/Terminal';
import SearchIcon from '@mui/icons-material/Search';
import "react-contexify/dist/ReactContexify.css";
import { getName } from '../../utils/re';
import { saveFav } from '../../objects/Storage';

const MENU_ID = "favmenu";

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
export default function App ({ theme }) {

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID
  });
  
  function handleItemClick ({ event, props, triggerEvent, data }) {
    console.warn( 'method not implemented', props.song );
  }

  function copyToClipboard ({ props }) {
    navigator.clipboard.writeText(getName(props.song, true));
  }
  
  function copyLinkToClipboard ({ props }) {
    navigator.clipboard.writeText(toBiliBili({ bvid: props.song.bvid, episode: props.song.page }));
  }

  function searchOnWeb ({ props }) {
    chrome.search.query({
        text: getName(props.song, true),
        disposition: "NEW_TAB",
      });
  }

  function searchInFav ({ props }) {
    props.performSearch(getName(props.song, true));
  }

  function searchOnBilibili ( {props} ) {
    window.open(`https://search.bilibili.com/all?keyword=${getName(props.song, true)}&from_source=webtop_search`);
  }

  function banSongBVid ({ event, props, triggerEvent, data }) {
    props.onDelete();
    props.currentFavList.bannedBVids.push(props.song.bvid);
    saveFav(props.currentFavList);
  }

  function displayMenu (e) {
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    show({
      event: e,
    });
  }

  return (
    <div>          
      <Menu id={MENU_ID} animation="slide" theme={theme}>
        <Item onClick={copyToClipboard}>
          <ContentCopyIcon/> &nbsp; {"把歌名复制到剪贴板"}
        </Item>
        <Item onClick={copyLinkToClipboard}>
          <LinkIcon/> &nbsp; {"把b站链接复制到剪贴板"}
        </Item>
        <Item onClick={ ({ props }) => goToBiliBili({ bvid: props.song.bvid, episode: props.song.page }) }>
          <BiliBiliIconSVG/> &nbsp; {"去b站"}
        </Item>
        <Item onClick={searchInFav}>
          <FindInPageIcon/> &nbsp; {"在歌单里搜索这首歌"}
        </Item>
        <Item onClick={searchOnWeb}>
          <SearchIcon/> &nbsp; {"在网上搜索这首歌"}
        </Item>
        <Item onClick={searchOnBilibili}>
          <SearchIcon/> &nbsp; {"在b站搜索这首歌"}
        </Item>
        <Separator></Separator>
        <Item onClick={banSongBVid}>
          <NotInterestedIcon/> &nbsp; {"删除并拉黑这首歌的bv号"}
        </Item>
        <Item onClick={handleItemClick}>
          <TerminalIcon/> &nbsp; {"console.log"}
        </Item>
      </Menu>
    </div>
  );
}

App.defaultProps = {
  theme: "light"
}