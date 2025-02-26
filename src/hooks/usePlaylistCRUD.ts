import { ReactNode, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import { DropResult } from '@hello-pangea/dnd';

import { useNoxSetting } from '@APM/stores/useApp';
import { dummyPlaylist } from '@APM/objects/Playlist';
import usePlaylistCRUD from '@APM/hooks/usePlaylistCRUD';
import textToDialogContent from '@components/dialogs/DialogContent';
import { updateSubscribeFavList as _updateSubscribeFavList } from '@APM/utils/BiliSubscribe';
import { reorder } from '@APM/utils/Utils';

interface UpdateSubscribeFavListProps {
  playlist: NoxMedia.Playlist;
  subscribeUrls?: string[];
}

export default (mPlaylist?: NoxMedia.Playlist) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const playlists = useNoxSetting((state) => state.playlists);
  const playlistIds = useNoxSetting((state) => state.playlistIds);
  const selectedList = useNoxSetting((state) => state.currentPlaylist);
  const setSelectedList = useNoxSetting((state) => state.setCurrentPlaylist);
  const addPlaylist = useNoxSetting((state) => state.addPlaylist);
  const setPlaylistIds = useNoxSetting((state) => state.setPlaylistIds);
  const updatePlaylist = useNoxSetting((state) => state.updatePlaylist);
  const removePlaylist = useNoxSetting((state) => state.removePlaylist);
  const getPlaylist = useNoxSetting((state) => state.getPlaylist);
  const searchList = useNoxSetting((state) => state.searchPlaylist);
  const setSearchList = useNoxSetting((state) => state.setSearchPlaylist);

  const [songsStoredAsNewFav, setSongsStoredAsNewFav] = useState<
    NoxMedia.Song[]
  >([]);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [searchInputVal, setSearchInputVal] = useState('');

  const [actionFavId, setActionFavId] = useState<NoxMedia.Playlist>();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [actionFavSong, setActionFavSong] = useState<NoxMedia.Song>();

  const confirm = useConfirm();
  const playlistCRUD = usePlaylistCRUD(mPlaylist);

  const onNewFav = (favName?: string) => {
    setOpenNewDialog(false);
    if (!favName) return;
    // console.log(val)
    const favList = dummyPlaylist(favName);
    if (songsStoredAsNewFav.length > 0) {
      favList.songList = songsStoredAsNewFav;
      setSongsStoredAsNewFav([]);
      favList.subscribeUrl = [searchInputVal.slice()];
    }
    addPlaylist(favList);
  };

  const handleDeleteFavClick = (playlist: NoxMedia.Playlist) => {
    confirm({
      title: '删除歌单？',
      description: `确认要删除歌单 ${playlist.title} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
    })
      .then(() => {
        removePlaylist(playlist.id);
        // @ts-ignore
        if (selectedList && selectedList.id === id) setSelectedList(undefined);
      })
      .catch();
  };

  const handleAddToFavClick = (
    playlist: NoxMedia.Playlist,
    song?: NoxMedia.Song,
  ) => {
    setActionFavId(playlist);
    setActionFavSong(song);
    setOpenAddDialog(true);
  };

  const onAddFav = async (
    songs?: NoxMedia.Song[],
    toId?: string,
    fromList?: NoxMedia.Playlist,
  ) => {
    setOpenAddDialog(false);
    if (!toId) return;
    updatePlaylist(await getPlaylist(toId), songs || fromList?.songList);
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const newFavLists = reorder(
      playlistIds,
      result.source.index,
      result.destination.index,
    );
    setPlaylistIds(newFavLists);
  };

  const onSongListDragEnd = (
    result: DropResult,
    playlist: NoxMedia.Playlist = mPlaylist!,
  ) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    // HACK: playlist cant change, otherwise it will trigger
    // useEffect to set checking to false.
    playlist.songList = reorder(
      playlist.songList,
      result.source.index,
      result.destination.index,
    );
    updatePlaylist(playlist);
  };

  const updateSubscribeFavList = async ({
    playlist,
    subscribeUrls,
  }: UpdateSubscribeFavListProps) => {
    const retrievedPlaylist = await getPlaylist(playlist.id);
    const oldListLength = retrievedPlaylist.songList.length;
    const newList = await _updateSubscribeFavList({
      playlist: retrievedPlaylist,
      subscribeUrls,
      updatePlaylist,
    });
    // sinse we do NOT delete songs from this operation, any update requiring a fav update really need
    // to have a change in list size.
    if (oldListLength !== newList?.songList?.length) {
      setSelectedList(newList ?? retrievedPlaylist);
    }
    return newList;
  };

  const playlistAnalyze = (playlist: NoxMedia.Playlist) => {
    const analytics = playlistCRUD.playlistAnalyze(playlist, 10);
    confirm({
      title: analytics.title,
      content: textToDialogContent(analytics.content),
      confirmationText: '好的',
      hideCancelButton: true,
    })
      .then()
      .catch();
  };
  async function cleanInvalidBVIds(
    playlist: NoxMedia.Playlist,
    action?: () => ReactNode,
  ) {
    const key = enqueueSnackbar(`正在查询歌单 ${playlist.title} 的bv号……`, {
      variant: 'info',
      persist: true,
      action,
    });
    const result = await playlistCRUD.playlistCleanup(playlist);
    closeSnackbar(key);
    enqueueSnackbar(
      `歌单 ${playlist.title} 清理完成，删除了${result}个失效的bv号`,
      { variant: 'success', autoHideDuration: 2000 },
    );
  }

  return {
    ...playlistCRUD,
    playlists,
    playlistIds,
    searchList,
    setSearchList,
    selectedList,
    setSelectedList,
    setSongsStoredAsNewFav,
    openNewDialog,
    setOpenNewDialog,
    openAddDialog,
    actionFavId,
    actionFavSong,
    setSearchInputVal,
    updateSubscribeFavList,
    onNewFav,
    handleDeleteFavClick,
    handleAddToFavClick,
    onAddFav,
    onDragEnd,
    onSongListDragEnd,
    playlistAnalyze,
    cleanInvalidBVIds,
  };
};
