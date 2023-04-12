import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
import { useConfirm } from 'material-ui-confirm';
import StorageManagerCtx from '../popup/App';
import { dummyFavList } from '../objects/Storage';
import { searchBiliURLs, defaultSearchList } from '../components/Search';
import { parseSongName } from '../utils/re';

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
export const updateSubscribeFavList = async (listObj, StorageManager, setSelectedList, subscribeUrls = undefined) => {
  try {
    const oldListLength = listObj.songList.length;
    if (subscribeUrls === undefined) {
      subscribeUrls = listObj.subscribeUrls;
    }
    if (subscribeUrls === undefined) return null;
    for (let i = 0, n = subscribeUrls.length; i < n; i++) {
      listObj.songList = (await searchBiliURLs({
        input: subscribeUrls[i],
        favList: [...listObj.songList.map((val) => val.bvid), ...listObj.bannedBVids],
        useBiliTag: listObj.useBiliShazam,
      })).songList.concat(listObj.songList);
    }
    const uniqueSongList = new Map();
    for (const tag of listObj.songList) {
      // cid should be a unique value? its a unique identifier for videos with multiple episodes.
      uniqueSongList.set(tag.id, tag);
    }
    listObj.songList = [...uniqueSongList.values()];
    for (let i = 0, n = listObj.songList.length; i < n; i++) {
      parseSongName(listObj.songList[i]);
    }
    // sinse we do NOT delete songs from this operation, any update requiring a fav update really need
    // to have a change in list size.
    if (oldListLength !== listObj.songList.length) {
      StorageManager.updateFavList(listObj);
      setSelectedList(listObj);
      return listObj.songList;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const useFavList = () => {
  const [favLists, setFavLists] = useState(null);
  const [searchList, setSearchList] = useState(defaultSearchList({}));
  const [favoriteList, dummySetter] = useState(dummyFavList());
  const [selectedList, setSelectedList] = useState(null);
  const [songsStoredAsNewFav, setSongsStoredAsNewFav] = useState(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [searchInputVal, setSearchInputVal] = useState('');

  const [actionFavId, setActionFavId] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [actionFavSong, setActionFavSong] = useState(null);

  const StorageManager = useContext(StorageManagerCtx);
  const confirm = useConfirm();

  useEffect(() => {
    // Caches setter and latest favList in StoreMng
    StorageManager.setFavLists = setFavLists;
    StorageManager.initFavLists();
  }, []);

  const findList = async (listid) => {
    switch (listid) {
      case favoriteList?.info?.id:
        return StorageManager.getFavFavList();
      default:
        break;
    }
    return listid.includes('FavList-Special-Search')
      ? searchList
      : favLists.find((f) => f.info.id === listid);
  };

  const getUpdateListMethod = (listid) => {
    return listid.includes('FavList-Special-Search')
      ? setSearchList
      : StorageManager.updateFavList.bind(StorageManager);
  };

  const handleDeleteFromSearchList = useCallback(async (listid, songid) => {
    const favList = await findList(listid);
    const index = favList.songList.findIndex((song) => song.id === songid);
    if (index === -1) return;
    favList.songList.splice(index, 1);
    const updatedToList = { ...favList };
    getUpdateListMethod(listid)(updatedToList);
  }, [searchList, selectedList, favLists]);

  const onNewFav = (val) => {
    setOpenNewDialog(false);
    if (val) {
      // console.log(val)
      const favList = StorageManager.addFavList(val, favLists);
      if (songsStoredAsNewFav) {
        favList.songList = songsStoredAsNewFav;
        setSongsStoredAsNewFav(null);
        favList.subscribeUrls = [searchInputVal.slice()];
        StorageManager.updateFavList(favList);
      }
    }
  };

  const handleDeleteFavClick = (playlistName, id) => {
    confirm({
      title: '删除歌单？',
      description: `确认要删除歌单 ${playlistName} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
    })
      .then(() => {
        const newFavListIDs = favLists.filter((FavId) => FavId.info.id !== id);
        StorageManager.deletFavList(id, newFavListIDs);
        if (selectedList && selectedList.info.id === id) setSelectedList(null);
      })
      .catch();
  };

  const handleAddToFavClick = (id, song) => {
    setActionFavId(id);
    setActionFavSong(song);
    setOpenAddDialog(true);
  };

  const onAddFav = async (fromId, toId, song) => {
    setOpenAddDialog(false);
    if (!toId) return;
    let fromList;
    const toList = await findList(toId);

    if (song) fromList = { songList: [song] };
    else fromList = await findList(fromId);

    const newSongList = fromList.songList.filter((s) => undefined === toList.songList.find((v) => v.id === s.id));
    // console.log(fromId, toId)

    const updatedToList = { info: toList.info, songList: newSongList.concat(toList.songList) };
    StorageManager.updateFavList(updatedToList);
  };

  const onDragEnd = (result) => {
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

  return [
    favLists, setFavLists,
    searchList, setSearchList,
    favoriteList,
    selectedList, setSelectedList,
    setSongsStoredAsNewFav,
    openNewDialog, setOpenNewDialog,
    openAddDialog,
    actionFavId,
    actionFavSong,
    setSearchInputVal,

    handleDeleteFromSearchList,
    onNewFav,
    handleDeleteFavClick,
    handleAddToFavClick,
    onAddFav,
    onDragEnd,
  ];
};

export default useFavList;
