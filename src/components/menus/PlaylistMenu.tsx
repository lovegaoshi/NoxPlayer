/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { Menu, Item, useContextMenu } from 'react-contexify';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import TerminalIcon from '@mui/icons-material/Terminal';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DownloadIcon from '@mui/icons-material/Download';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import 'react-contexify/dist/ReactContexify.css';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import { useConfirm } from 'material-ui-confirm';
import SyncIcon from '@mui/icons-material/Sync';

import { useNoxSetting } from '@stores/useApp';
import { syncFavlist } from '@utils/Bilibili/bilifavOperate';
import usePlaylistCRUD from '@hooks/usePlaylistCRUD';

const MENU_ID = 'favlistmenu';

interface Props {
  event: any;
  props?: any;
  triggerEvent: any;
  data: any;
}

interface ExecTask {
  task: () => Promise<unknown>;
  executingMsg: string;
  successMsg: string;
  errorMsg?: string;
}

/**
 * right-click context menu for FavList.
 * has menu items:
 * debug
 * @returns
 */
export default function App({ theme = 'light' }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const getPlaylist = useNoxSetting((state) => state.getPlaylist);
  const confirm = useConfirm();
  const playlistCRUD = usePlaylistCRUD();
  const circularProgress = () => <CircularProgress />;

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  async function handleItemClick({ props }: Props) {
    console.warn('method not implemented', props.favlist);
  }

  const loadTask = async ({
    task,
    executingMsg,
    successMsg,
    errorMsg,
  }: ExecTask) => {
    const key = enqueueSnackbar(executingMsg, {
      variant: 'info',
      persist: true,
      action: circularProgress,
    });
    try {
      await task();
      closeSnackbar(key);
      enqueueSnackbar(successMsg, {
        variant: 'success',
        autoHideDuration: 2000,
      });
    } catch (e) {
      closeSnackbar(key);
      console.error(e);
      if (errorMsg) {
        enqueueSnackbar(errorMsg, { variant: 'error', autoHideDuration: 2000 });
      }
    }
  };

  async function syncFavlistToBilibili({ props }: Props) {
    const playlist = await getPlaylist(props.favlist.id);
    loadTask({
      task: () => syncFavlist(playlist),
      executingMsg: `正在同步歌单 ${props.favlist.title} 到b站收藏夹……`,
      successMsg: 'done!',
      errorMsg: 'ERROR!',
    });
  }

  async function BiliShazam(
    { event, props, triggerEvent, data }: Props,
    options = { forced: false },
  ) {
    const playlist = await getPlaylist(props.favlist.id);
    loadTask({
      task: () => playlistCRUD.playlistBiliShazam(playlist),
      executingMsg: `正在用b站识歌标识歌单 ${props.favlist.title}……`,
      successMsg: `歌单 ${props.favlist.title} 已经用b站识歌更新乐！`,
      errorMsg: `b站识歌标识歌单 ${props.favlist.title} 失败`,
    });
  }

  async function removeBiliShazam({ event, props, triggerEvent, data }: Props) {
    const playlist = await getPlaylist(props.favlist.id);
    loadTask({
      task: () => playlistCRUD.playlistRemoveBiliShazamed(playlist),
      executingMsg: `正在用b站识歌标识歌单 ${props.favlist.title}……`,
      successMsg: `歌单 ${props.favlist.title} 的b站识歌记录全部清除乐！`,
    });
  }

  function clearPlaylist({ event, props, triggerEvent, data }: Props) {
    confirm({
      title: '清空歌单？',
      description: `确认要清空歌单 ${props.favlist.title} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
    })
      .then(() => {
        playlistCRUD.playlistClear(props.favlist);
        enqueueSnackbar(`歌单 ${props.favlist.title} 清空乐！`, {
          variant: 'success',
          autoHideDuration: 2000,
        });
      })
      .catch();
  }

  function reloadPlaylist({ event, props, triggerEvent, data }: Props) {
    confirm({
      title: '重新载入歌单？',
      description: `确认要清空并重新载入歌单 ${props.favlist.title} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
    }).then(async () => {
      const playlist = await getPlaylist(props.favlist.id);
      loadTask({
        task: () => playlistCRUD.playlistReload(playlist),
        executingMsg: `正在重新载入歌单 ${props.favlist.title} 的bv号……`,
        successMsg: `歌单 ${props.favlist.title} 重载了！`,
        errorMsg: `歌单 ${props.favlist.title} 重载失败！`,
      });
    });
  }

  return (
    <div>
      <Menu id={MENU_ID} animation='slide' theme={theme}>
        <Item onClick={syncFavlistToBilibili}>
          <SyncIcon /> &nbsp; 同步到b站收藏夹
        </Item>
        <Item onClick={BiliShazam}>
          <YoutubeSearchedForIcon /> &nbsp; b站识歌
        </Item>
        <Item onClick={(props) => removeBiliShazam(props)}>
          <DeleteIcon /> &nbsp; 删除b站识歌
        </Item>
        <Item onClick={reloadPlaylist}>
          <RefreshIcon /> &nbsp; 从bv号重载歌单
        </Item>
        <Item onClick={clearPlaylist}>
          <ClearAllIcon /> &nbsp; 清空歌单
        </Item>
        <Item
          onClick={({ props }) =>
            getPlaylist(props.favlist.id).then((playlist) =>
              playlistCRUD.playlistAnalyze(playlist),
            )
          }
        >
          <AnalyticsIcon /> &nbsp; 歌单统计
        </Item>
        <Item onClick={handleItemClick}>
          <DownloadIcon /> &nbsp; 导出bv号为csv
        </Item>
        <Item
          onClick={({ props }) =>
            getPlaylist(props.favlist.id).then((playlist) =>
              playlistCRUD.playlistCleanup(playlist),
            )
          }
        >
          <CleaningServicesIcon /> &nbsp; 清理失效的bv号
        </Item>
        <Item onClick={handleItemClick}>
          <TerminalIcon /> &nbsp; console.log
        </Item>
      </Menu>
    </div>
  );
}
