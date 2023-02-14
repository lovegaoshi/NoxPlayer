import React from 'react';
import {
    Menu,
    Item,
    Separator,
    useContextMenu
  } from "react-contexify";
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import TerminalIcon from '@mui/icons-material/Terminal';
import "react-contexify/dist/ReactContexify.css";
import  { BiliShazamOnSonglist } from '../../background/DataProcess';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import { removeSongBiliShazamed } from '../../objects/Song';

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
    console.warn( 'method not implemented', props.favlist.songList );
  }

  function updateFavlist(props, msg, option = { variant: 'success', autoHideDuration: 2000 }) {
    props.updateFavList(props.favlist);
    enqueueSnackbar(msg, option);
  }

  async function BiliShazam ({ event, props, triggerEvent, data }, options = { forced: false }) {
    const key = enqueueSnackbar(`正在用b站识歌标识歌单${props.favlist.info.title}……`, { variant: 'info', persist: true, action: () => {return (<CircularProgress/>)} });
    try {
      await BiliShazamOnSonglist(props.favlist.songList, options.forced);
    } catch (e) {
      console.warn(`b站识歌标识歌单${props.favlist.info.title}失败`, e)
    }
    closeSnackbar(key);
    updateFavlist(props, `歌单${props.favlist.info.title}已经用b站识歌更新乐！`);
  }

  function removeBiliShazam ({ event, props, triggerEvent, data }) {
    for (let song of props.favlist.songList) {
      removeSongBiliShazamed(song);
    }
    updateFavlist(props, `歌单${props.favlist.info.title}的b站识歌记录全部清除乐！`);
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
        <Item onClick={(props) => removeBiliShazam(props, {})}>
          <DeleteIcon/> &nbsp; {"Remove Bilibili shazam"}
        </Item>
        <Item onClick={(props) => BiliShazam(props, { forced: true })}>
          <YoutubeSearchedForIcon/> &nbsp; {"Use Bilibili shazam (forced)"}
        </Item>
        <Item onClick={handleItemClick}>
          <RefreshIcon/> &nbsp; {"Reload playlist from bilibili"}
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