import { StorageKeys } from '@enums/Storage';

export const loopFavLists = (callback: (v?: NoxMedia.Playlist) => void) => {
  chrome.storage.local.get([StorageKeys.MY_FAV_LIST_KEY], (result1) => {
    const favlistIds: string[] = result1[StorageKeys.MY_FAV_LIST_KEY];
    if (favlistIds === undefined) return;
    favlistIds.push(StorageKeys.FAVORITE_PLAYLIST_KEY);
    chrome.storage.local.get(favlistIds, (result) => {
      favlistIds.forEach((id) => callback(result[id]));
    });
  });
};

export default async function update3000() {
  console.debug('3.0.0.0 update; migrate to APMs playlist data structure.');
  const updateDataStructure = (favlist: any) => {
    const newFavlist: NoxMedia.Playlist = {
      ...favlist,
      title: favlist.title,
      id: favlist.id,
      type: favlist.type,
      songList: favlist.songList,
      subscribeUrl: favlist.subscribeUrls,
      blacklistedUrl: favlist.bannedBVids,
      lastSubscribed: 0,
      useBiliShazam: favlist.useBiliShazam,
      biliSync: favlist.biliSync,
      newSongOverwrite: false,
    };
    chrome.storage.local.set({ [favlist.id]: newFavlist });
  };
  loopFavLists(updateDataStructure);
  /**
   * 
   * depreciate PlaylistDict:
  songList: Array<NoxMedia.Song>;
  info: { title: string; id: string };
  subscribeUrls: Array<string>;
  settings: {
    autoRSSUpdate: boolean;
  };
  useBiliShazam: boolean;
  biliSync: boolean;
  bannedBVids: Array<string>;
  showFavoriteList: boolean;

  use NoxMedia.Playlist instead.
  
  title: string;
  id: string;
  type: string;

  songList: Array<NoxMedia.Song>;

  subscribeUrl: Array<string>;
  blacklistedUrl: Array<string>;
  lastSubscribed: number;

  useBiliShazam: boolean;
  biliSync: boolean;
  newSongOverwrite?: boolean;
   */
}
