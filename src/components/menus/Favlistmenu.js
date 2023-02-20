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
import ClearAllIcon from '@mui/icons-material/ClearAll';
import TerminalIcon from '@mui/icons-material/Terminal';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DownloadIcon from '@mui/icons-material/Download';
import "react-contexify/dist/ReactContexify.css";
import  { BiliShazamOnSonglist, getBVIDList } from '../../background/DataProcess';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import { removeSongBiliShazamed } from '../../objects/Song';
import { useConfirm } from "material-ui-confirm";
import { favListAnalytics } from '../../utils/Analytics';
import { textToDialogContent } from '../dialogs/genericDialog';

const MENU_ID = "favlistmenu";

/**
 * right-click context menu for FavList.
 * has menu items:
 * debug
 * @returns 
 */
export default function App ({ theme }) {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const confirm = useConfirm();

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID
  });
  
  function handleItemClick ({ event, props, triggerEvent, data }) {
    console.warn('method not implemented', props.favlist);
  }

  function updateFavlist (props, msg, option = { variant: 'success', autoHideDuration: 2000 }) {
    props.updateFavList(props.favlist);
    enqueueSnackbar(msg, option);
  }

  async function BiliShazam ({ event, props, triggerEvent, data }, options = { forced: false }) {
    const key = enqueueSnackbar(`正在用b站识歌标识歌单 ${props.favlist.info.title }……`, { variant: 'info', persist: true, action: () => {return (<CircularProgress/>)} });
    try {
      await BiliShazamOnSonglist(props.favlist.songList, options.forced);
    } catch (e) {
      console.warn(`b站识歌标识歌单 ${props.favlist.info.title} 失败`, e)
    }
    closeSnackbar(key);
    updateFavlist(props, `歌单 ${props.favlist.info.title} 已经用b站识歌更新乐！`);
  }

  function removeBiliShazam ({ event, props, triggerEvent, data }) {
    for (let song of props.favlist.songList) {
      removeSongBiliShazamed(song);
    }
    updateFavlist(props, `歌单 ${props.favlist.info.title} 的b站识歌记录全部清除乐！`);
  }

  function clearPlaylist ({ event, props, triggerEvent, data }) {
    confirm({ 
      title: '清空歌单？', 
      description: `确认要清空歌单 ${props.favlist.info.title} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
   })
   .then( () => {
    props.favlist.songList = [];
    updateFavlist(props, `歌单 ${props.favlist.info.title} 清空乐！`);
   })
   .catch()
  }

  function reloadPlaylist ({ event, props, triggerEvent, data }) {
    confirm({ 
      title: '重新载入歌单？', 
      description: `确认要清空并重新载入歌单 ${props.favlist.info.title} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
   })
   .then(() => {
      const key = enqueueSnackbar(
        `正在重新载入歌单 ${props.favlist.info.title} 的bv号……`,
        { variant: 'info', persist: true, action: () => {return (<CircularProgress/>)} });
      let bvids = [];
      for (const song of props.favlist.songList) {
        if (!bvids.includes(song.bvid)) {
          bvids.push(song.bvid);
        }
      }
      getBVIDList({ bvids })
      .then((val) => {
          props.favlist.songList = val;
          closeSnackbar(key);
          updateFavlist(props, `歌单 ${props.favlist.info.title} 重载了！`);
      })
      .catch( () => closeSnackbar(key))    
   })
   .catch()
  }
  
  function analyzeFavlist ({ event, props, triggerEvent, data }) {
    const analytics = favListAnalytics(props.favlist);
    confirm({
      title: `歌单 ${props.favlist.info.title} 的统计信息`,
      content: textToDialogContent([
        '歌单内最常出现的歌：' + analytics.songTop10.map(val => `${val[0]} (${String(val[1])})`).join(", "),
        `bv号总共有 ${String(analytics.bvid.length)}个，平均每bv号有${(analytics.totalCount / analytics.bvid.length).toFixed(1)}首歌`,
        `shazam失败的歌数: ${String(analytics.invalidShazamCount)}\/${String(analytics.totalCount)} (${(analytics.invalidShazamCount * 100 / analytics.totalCount).toFixed(1)}%)`,
      ]),
      confirmationText: "好的",
      hideCancelButton: true,
    }).then().catch();
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
        <Item onClick={reloadPlaylist}>
          <RefreshIcon/> &nbsp; {"Reload playlist from bilibili"}
        </Item>
        <Item onClick={clearPlaylist}>
          <ClearAllIcon/> &nbsp; {"Clear playlist"}
        </Item>
        <Item onClick={analyzeFavlist}>
          <AnalyticsIcon/> &nbsp; {"Analytics"}
        </Item>
        <Item onClick={handleItemClick}>
          <DownloadIcon/> &nbsp; {"Export into a yt-dlp url list"}
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