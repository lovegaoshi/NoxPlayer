import { useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

import { useNoxSetting } from '@APM/stores/useApp';
import { dummyPlaylist } from '@APM/objects/Playlist';
import usePlaylist from '@APM/hooks/usePlaylist';
import { fetchVideoInfo } from '@APM/utils/mediafetch/bilivideo';
// eslint-disable-next-line import/no-unresolved
import textToDialogContent from '@components/dialogs/DialogContent';
import { updateSubscribeFavList as updateSubscribeFavListRaw } from '@APM/utils/BiliSubscribe';
import { reorder } from '@APM/utils/Utils';

/**
 * this function updates the input playlist by its subscription url to include the missing videos.
 * @param {object} listObj the playlist to be updated.
 * @param {function} setSelectedList useState setter for FavList that sets its selectedList state.
 * @param {Array} subscribeUrls the subscribe urls to be checked in an array format. if not specified,
 * this is defualted to be listObj.subscribeUrls.
 * this state is passed to Fav to trigger a rerender.
 */

interface UpdateSubscribeFavListProps {
  playlist: NoxMedia.Playlist;
  subscribeUrls?: string[];
}

const useFavList = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const playlists = useNoxSetting((state) => state.playlists);
  const playlistIds = useNoxSetting((state) => state.playlistIds);
  const favoritePlaylist = useNoxSetting((state) => state.favoritePlaylist);
  const selectedList = useNoxSetting((state) => state.currentPlaylist);
  const setSelectedList = useNoxSetting((state) => state.setCurrentPlaylist);
  const addPlaylist = useNoxSetting((state) => state.addPlaylist);
  const setPlaylistIds = useNoxSetting((state) => state.setPlaylistIds);
  const updatePlaylist = useNoxSetting((state) => state.updatePlaylist);
  const removePlaylist = useNoxSetting((state) => state.removePlaylist);
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
  const { playlistAnalyze } = usePlaylist();

  const handleDeleteFromSearchList = async (listid: string, songid: string) => {
    const favList = playlists[listid];
    if (favList === undefined) {
      console.error(`favList not found: ${listid}`);
      return;
    }
    const index = favList.songList.findIndex((song) => song.id === songid);
    if (index === -1) return;
    favList.songList.splice(index, 1);
    const updatedToList = { ...favList };
    updatePlaylist(updatedToList);
  };

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

  const onAddFav = async ({
    songs,
    fromList,
    toId,
  }: {
    songs: NoxMedia.Song[];
    fromList?: NoxMedia.Playlist;
    toId?: string;
  }) => {
    setOpenAddDialog(false);
    if (!toId) return;
    updatePlaylist(
      playlists[toId]!,
      songs[0] === undefined ? fromList?.songList : songs,
    );
  };

  const onDragEnd = (result: any) => {
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

  const updateSubscribeFavList = async ({
    playlist,
    subscribeUrls,
  }: UpdateSubscribeFavListProps) => {
    const oldListLength = playlist.songList.length;
    const newList: NoxMedia.Playlist = await updateSubscribeFavListRaw({
      playlist,
      subscribeUrls,
      updatePlaylist,
    });
    // sinse we do NOT delete songs from this operation, any update requiring a fav update really need
    // to have a change in list size.
    if (oldListLength !== newList.songList.length) {
      setSelectedList(playlists[playlist.id]!);
    }
    return newList;
  };

  const analyzeFavlist = (playlist: NoxMedia.Playlist) => {
    const analytics = playlistAnalyze(playlist, 10);
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
    action?: () => JSX.Element,
  ) {
    const uniqBVIds: string[] = [];
    const promises = [];
    const validBVIds: string[] = [];
    const key = enqueueSnackbar(`正在查询歌单 ${playlist.title} 的bv号……`, {
      variant: 'info',
      persist: true,
      action,
    });
    for (const song of playlist.songList) {
      if (uniqBVIds.includes(song.bvid)) continue;
      uniqBVIds.push(song.bvid);
      // fetchVideoInfo either returns a valid object or unidentified.
      promises.push(
        fetchVideoInfo(song.bvid).then((val) => {
          if (val !== undefined) {
            validBVIds.push(val.bvid);
          }
        }),
      );
    }
    await Promise.all(promises);
    playlist.songList = playlist.songList.filter((val) =>
      validBVIds.includes(val.bvid),
    );
    closeSnackbar(key);
    updatePlaylist(playlist, [], []);
    enqueueSnackbar(
      `歌单 ${playlist.title} 清理完成，删除了${
        validBVIds.filter((v) => v === undefined).length
      }个失效的bv号`,
      { variant: 'success', autoHideDuration: 2000 },
    );
  }

  return {
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
    handleDeleteFromSearchList,
    onNewFav,
    handleDeleteFavClick,
    handleAddToFavClick,
    onAddFav,
    onDragEnd,
    analyzeFavlist,
    cleanInvalidBVIds,
  };
};

export default useFavList;
