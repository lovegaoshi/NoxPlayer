import { useState } from 'react';
import { useConfirm } from 'material-ui-confirm';

import useNoxStore from '@hooks/useStore';
import { parseSongName } from '@APM/stores/appStore';
import { useNoxSetting } from '@APM/stores/useApp';
import { defaultSearchList, dummyFavList } from '@objects/Playlist';
import { searchBiliURLs } from '@APM/utils/BiliSearch';
import favListAnalytics from '@APM/utils/Analytics';
// eslint-disable-next-line import/no-unresolved
import textToDialogContent from '@/components/dialogs/DialogContent';

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
  setSelectedList: (playlist: NoxMedia.Playlist) => void;
  subscribeUrls?: string[];
}

export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  if (removed === undefined) return result;
  result.splice(endIndex, 0, removed);

  return result;
};

const useFavList = () => {
  const playlists = useNoxSetting((state) => state.playlists);
  const playlistIds = useNoxSetting((state) => state.playlistIds);
  const favoritePlaylist = useNoxSetting((state) => state.favoritePlaylist);
  const selectedList = useNoxSetting((state) => state.currentPlaylist);
  const setSelectedList = useNoxSetting((state) => state.setCurrentPlaylist);
  const addPlaylist = useNoxSetting((state) => state.addPlaylist);
  const setPlaylistIds = useNoxSetting((state) => state.setPlaylistIds);
  const updatePlaylist = useNoxSetting((state) => state.updatePlaylist);
  const removePlaylist = useNoxSetting((state) => state.removePlaylist);

  const [searchList, setSearchList] = useState(defaultSearchList({}));
  const [favoriteList] = useState(dummyFavList(''));
  const [songsStoredAsNewFav, setSongsStoredAsNewFav] = useState(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [searchInputVal, setSearchInputVal] = useState('');

  const [actionFavId, setActionFavId] = useState<NoxMedia.Playlist>();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [actionFavSong, setActionFavSong] = useState<NoxMedia.Song>();

  const confirm = useConfirm();

  const setPlaylistRefreshProgress = useNoxStore(
    (state) => state.setPlaylistRefreshProgress,
  );

  const findList = (listid: string): NoxMedia.Playlist => {
    switch (listid) {
      case favoriteList?.id:
        return favoritePlaylist;
      default:
        break;
    }
    if (listid.includes('FavList-Special-Search')) return searchList;
    const foundList = playlistIds.find((f) => f === listid);
    if (foundList) {
      const playlist = playlists[foundList];
      if (playlist !== undefined) return playlist;
    }
    throw new Error(`[findList] playlist ${listid} not found`);
  };

  const getUpdateListMethod = (listid: string) => {
    return listid.includes('FavList-Special-Search')
      ? setSearchList
      : updatePlaylist;
  };

  const handleDeleteFromSearchList = async (listid: string, songid: string) => {
    const favList = findList(listid);
    const index = favList.songList.findIndex((song) => song.id === songid);
    if (index === -1) return;
    favList.songList.splice(index, 1);
    const updatedToList = { ...favList };
    getUpdateListMethod(listid)(updatedToList);
  };

  const onNewFav = (favName?: string) => {
    setOpenNewDialog(false);
    if (!favName) return;
    // console.log(val)
    const favList = dummyFavList(favName);
    if (songsStoredAsNewFav) {
      favList.songList = songsStoredAsNewFav;
      setSongsStoredAsNewFav(null);
      favList.subscribeUrl = [searchInputVal.slice()];
    }
    addPlaylist(favList);
  };

  const handleDeleteFavClick = (playlistName: string, id: string) => {
    confirm({
      title: '删除歌单？',
      description: `确认要删除歌单 ${playlistName} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
    })
      .then(() => {
        removePlaylist(id);
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
      findList(toId),
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
    try {
      const oldListLength = playlist.songList.length;
      if (subscribeUrls === undefined) {
        subscribeUrls = playlist.subscribeUrl;
      }
      if (subscribeUrls === undefined) return null;
      // TODO: this is stupid. needs to change:
      // 1. set the unique map first with listObj, then
      // in loop set new stuff into it, instead of concat lists
      // 2. order this correctly. this for loop needs to be reversed
      for (let i = 0, n = subscribeUrls.length; i < n; i++) {
        playlist.songList = (
          await searchBiliURLs({
            progressEmitter: setPlaylistRefreshProgress,
            input: subscribeUrls[i] || '',
            favList: [
              ...playlist.songList.map((val) => val.bvid),
              ...playlist.blacklistedUrl,
            ],
            useBiliTag: playlist.useBiliShazam,
          })
        ).concat(playlist.songList);
      }
      const uniqueSongList = new Map();
      playlist.songList.forEach((tag) => uniqueSongList.set(tag.id, tag));
      playlist.songList = [...uniqueSongList.values()];
      playlist.songList.forEach((song) => parseSongName(song));
      // sinse we do NOT delete songs from this operation, any update requiring a fav update really need
      // to have a change in list size.
      if (oldListLength !== playlist.songList.length) {
        updatePlaylist(playlist, [], []);
        setSelectedList(playlist);
        return playlist.songList;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const analyzeFavlist = (playlist: NoxMedia.Playlist) => {
    const analytics = favListAnalytics(playlist);
    confirm({
      title: `歌单 ${playlist.title} 的统计信息`,
      content: textToDialogContent([
        `歌单内总共有${analytics.songsUnique.size}首独特的歌`,
        `歌单内最常出现的歌：${analytics.songTop10
          .map((val) => `${val[0]} (${String(val[1])})`)
          .join(', ')}`,
        `最近的新歌：${Array.from(analytics.songsUnique)
          .slice(-10)
          .reverse()
          .join(', ')}`,
        `bv号总共有${String(analytics.bvid.size)}个，平均每bv号有${(
          analytics.totalCount / analytics.bvid.size
        ).toFixed(1)}首歌`,
        `shazam失败的歌数: ${String(analytics.invalidShazamCount)}/${String(
          analytics.totalCount,
        )} (${(
          (analytics.invalidShazamCount * 100) /
          analytics.totalCount
        ).toFixed(1)}%)`,
      ]),
      confirmationText: '好的',
      hideCancelButton: true,
    })
      .then()
      .catch();
  };
  return {
    playlists,
    playlistIds,
    searchList,
    setSearchList,
    favoriteList,
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
  };
};

export default useFavList;
