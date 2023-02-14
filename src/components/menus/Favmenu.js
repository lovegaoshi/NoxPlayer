import React from 'react';
import {
    Menu,
    Item,
    Separator,
    useContextMenu
  } from "react-contexify";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { BiliBiliIconSVG, goToBiliBili } from '../bilibiliIcon'; 
import TerminalIcon from '@mui/icons-material/Terminal';
import SearchIcon from '@mui/icons-material/Search';
import "react-contexify/dist/ReactContexify.css";

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
export default function App({ theme }) {

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID
  });
  
  function handleItemClick ({ event, props, triggerEvent, data }) {
    console.warn( 'method not implemented', props.song );
  }

  function copyToClipboard ({ props }) {
    navigator.clipboard.writeText(props.song.parsedName);
  }

  function searchOnWeb ({ props }) {
    chrome.search.query({
        text: props.song.parsedName,
        disposition: "NEW_TAB",
      });
  }

  function searchOnBilibili ( {props} ) {
    window.open(`https://search.bilibili.com/all?keyword=${props.song.parsedName}&from_source=webtop_search`);
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
          <ContentCopyIcon/> &nbsp; {"Copy song name to clipboard"}
        </Item>
        <Item onClick={ ({ props }) => goToBiliBili(props.song.bvid) }>
          <BiliBiliIconSVG/> &nbsp; {"Go to Bilibili page"}
        </Item>
        <Item onClick={searchOnWeb}>
          <SearchIcon/> &nbsp; {"Search song on the web"}
        </Item>
        <Item onClick={searchOnBilibili}>
          <SearchIcon/> &nbsp; {"Search song on Bilibili"}
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