import React from 'react';
import {
    Menu,
    Item,
    Separator,
    useContextMenu
  } from "react-contexify";

import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import TerminalIcon from '@mui/icons-material/Terminal';
import "react-contexify/dist/ReactContexify.css";
import  {BiliShazamOnSonglist } from '../../background/DataProcess';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';

const MENU_ID = "favlistmenu";

/**
 * right-click context menu for FavList.
 * has menu items:
 * debug
 * @returns 
 */
export default function App({ theme }) {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID
  });
  
  function handleItemClick ({ event, props, triggerEvent, data }) {
    console.warn( 'method not implemented', props.favlist.songList[0].getName() );
  }

  async function BiliShazam ({ event, props, triggerEvent, data }, options) {
    const key = enqueueSnackbar(`正在用b站识歌标识歌单${props.favlist.info.title}`, { variant: 'info', persist: true, action: () => {return (<CircularProgress/>)} });
    try {
      await BiliShazamOnSonglist(props.favlist.songList);
    } catch (e) {
      console.warn(`b站识歌标识歌单${props.favlist.info.title}失败`, e)
    }
    closeSnackbar(key);
    props.updateFavList(props.favlist);
    enqueueSnackbar(`歌单${props.favlist.info.title}已经用b站识歌更新乐！`, { variant: 'success', autoHideDuration: 2000 });
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
        <Item onClick={BiliShazam}>
          <YoutubeSearchedForIcon/> &nbsp; {"Use Bilibili shazam"}
        </Item>
        <Item onClick={(props) => BiliShazam(props, { forced : true })}>
          <YoutubeSearchedForIcon/> &nbsp; {"Use Bilibili shazam (forced)"}
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