import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useConfirm } from 'material-ui-confirm';

import useNoxStore from '@hooks/useStore';
import { StorageManagerCtx } from '@contexts/StorageManagerContext';
import { dummyFavList } from '@utils/ChromeStorage';
import { parseSongName } from '@stores/appStore';
import { searchBiliURLs, defaultSearchList } from '../components/Search';

/**
 * this function updates the input playlist by its subscription url to include the missing videos.
 * @param {object} listObj the playlist to be updated.
 * @param {Object} StorageManager storageManager object that is used to update chrome.storage.local.
 * calls its updateFavList method.
 * @param {function} setSelectedList useState setter for FavList that sets its selectedList state.
 * @param {Array} subscribeUrls the subscribe urls to be checked in an array format. if not specified,
 * this is defualted to be listObj.subscribeUrls.
 * this state is passed to Fav to trigger a rerender.
 */

interface UpdateSubscribeFavListProps {
  playlist: NoxMedia.Playlist;
  StorageManager: any;
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
  const [favLists, setFavLists] = useState<NoxMedia.Playlist[]>([]);
  const [searchList, setSearchList] = useState(defaultSearchList({}));
  const [favoriteList] = useState(dummyFavList(''));
  const [selectedList, setSelectedList] = useState<NoxMedia.Playlist>();
  const [songsStoredAsNewFav, setSongsStoredAsNewFav] = useState(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [searchInputVal, setSearchInputVal] = useState('');

  const [actionFavId, setActionFavId] = useState<string>();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [actionFavSong, setActionFavSong] = useState<NoxMedia.Song>();

  const StorageManager = useContext(StorageManagerCtx);
  const confirm = useConfirm();

  const setPlaylistRefreshProgress = useNoxStore(
    (state) => state.setPlaylistRefreshProgress,
  );

  useEffect(() => {
    // Caches setter and latest favList in StoreMng
    StorageManager.setFavLists = setFavLists;
    StorageManager.initFavLists();
  }, []);

  const findList = async (listid: string): Promise<NoxMedia.Playlist> => {
    switch (listid) {
      case favoriteList?.info?.id:
        return StorageManager.getFavFavList();
      default:
        break;
    }
    if (listid.includes('FavList-Special-Search')) return searchList;
    const foundList = favLists.find((f) => f.info.id === listid);
    if (foundList) return foundList;
    throw new Error(`[findList] playlist ${listid} not found`);
  };

  const getUpdateListMethod = (listid: string) => {
    return listid.includes('FavList-Special-Search')
      ? setSearchList
      : StorageManager.updateFavList.bind(StorageManager);
  };

  const handleDeleteFromSearchList = useCallback(
    async (listid: string, songid: string) => {
      const favList = await findList(listid);
      const index = favList.songList.findIndex((song) => song.id === songid);
      if (index === -1) return;
      favList.songList.splice(index, 1);
      const updatedToList = { ...favList };
      getUpdateListMethod(listid)(updatedToList);
    },
    [searchList, selectedList, favLists],
  );

  const onNewFav = (favName?: string) => {
    setOpenNewDialog(false);
    if (favName) {
      // console.log(val)
      const favList = StorageManager.addFavList(favName, favLists);
      if (songsStoredAsNewFav) {
        favList.songList = songsStoredAsNewFav;
        setSongsStoredAsNewFav(null);
        favList.subscribeUrls = [searchInputVal.slice()];
        StorageManager.updateFavList(favList);
      }
    }
  };

  const handleDeleteFavClick = (playlistName: string, id: string) => {
    confirm({
      title: '删除歌单？',
      description: `确认要删除歌单 ${playlistName} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
    })
      .then(() => {
        const newFavListIDs = favLists.filter((FavId) => FavId.info.id !== id);
        StorageManager.deletFavList(id, newFavListIDs);
        if (selectedList && selectedList.info.id === id)
          setSelectedList(undefined);
      })
      .catch();
  };

  const handleAddToFavClick = (id: string, song: NoxMedia.Song) => {
    setActionFavId(id);
    setActionFavSong(song);
    setOpenAddDialog(true);
  };

  const onAddFav = async (
    fromId: string,
    toId?: string,
    song?: NoxMedia.Song,
  ) => {
    setOpenAddDialog(false);
    if (!toId) return;
    let fromList;
    const toList = await findList(toId);

    if (song) fromList = { songList: [song] };
    else fromList = await findList(fromId);

    const newSongList = fromList.songList.filter(
      (s) => undefined === toList.songList.find((v) => v.id === s.id),
    );
    // console.log(fromId, toId)

    const updatedToList = {
      info: toList.info,
      songList: newSongList.concat(toList.songList),
    };
    StorageManager.updateFavList(updatedToList);
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const newFavLists = reorder(
      favLists,
      result.source.index,
      result.destination.index,
    );
    setFavLists(newFavLists);
    StorageManager.saveMyFavList(newFavLists);
  };

  const updateSubscribeFavList = async ({
    playlist,
    subscribeUrls,
  }: UpdateSubscribeFavListProps) => {
    try {
      const oldListLength = playlist.songList.length;
      if (subscribeUrls === undefined) {
        subscribeUrls = playlist.subscribeUrls;
      }
      if (subscribeUrls === undefined) return null;
      // TODO: this is stupid. needs to change:
      // 1. set the unique map first with listObj, then
      // in loop set new stuff into it, instead of concat lists
      // 2. order this correctly. this for loop needs to be reversed
      for (let i = 0, n = subscribeUrls.length; i < n; i++) {
        playlist.songList = (
          await searchBiliURLs({
            input: subscribeUrls[i],
            favList: [
              ...playlist.songList.map((val) => val.bvid),
              ...playlist.bannedBVids,
            ],
            useBiliTag: playlist.useBiliShazam,
          })
        ).songList // @ts-ignore
          .concat(playlist.songList);
      }
      const uniqueSongList = new Map();
      playlist.songList.forEach((tag) => uniqueSongList.set(tag.id, tag));
      playlist.songList = [...uniqueSongList.values()];
      playlist.songList.forEach((song) => parseSongName(song));
      // sinse we do NOT delete songs from this operation, any update requiring a fav update really need
      // to have a change in list size.
      if (oldListLength !== playlist.songList.length) {
        StorageManager.updateFavList(playlist);
        setSelectedList(playlist);
        return playlist.songList;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return [
    favLists,
    setFavLists,
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
  ];
};

export default useFavList;
