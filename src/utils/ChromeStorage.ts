import { v4 as uuidv4 } from 'uuid';

import type { NoxStorage } from '@APM/types/storage';
import {
  DEFAULT_SETTING as DEFAULT_SETTING_BASE,
  EXPORT_OPTIONS,
} from '@APM/enums/Storage';

export { EXPORT_OPTIONS } from '@APM/enums/Storage';

// https://space.bilibili.com/5053504/channel/seriesdetail?sid=2664851
export const INITIAL_PLAYLIST = ['5053504', '2664851'];
export const MY_FAV_LIST_KEY = 'MyFavList';
export const FAV_FAV_LIST_KEY = 'FavFavList-Special';
export const LYRIC_MAPPING = 'LyricMappings';
export const LAST_PLAY_LIST = 'LastPlayList';
export const PLAYER_SETTINGS = 'PlayerSetting';
export const CURRENT_PLAYING = 'CurrentPlaying';
export const FAVLIST_AUTO_UPDATE_TIMESTAMP = 'favListAutoUpdateTimestamp';

export interface PlayListDict {
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
  [key: string]: any;
}

export const dummyFavList = (favName: string): NoxMedia.Playlist => {
  return {
    songList: [],
    info: { title: favName, id: `FavList-${uuidv4()}` },
    title: favName,
    id: `FavList-${uuidv4()}`,
    // this is not a Set because we need to serialize this
    // for importing/exporting playlists.
    subscribeUrls: [],
    settings: {
      autoRSSUpdate: false,
    },
    useBiliShazam: false,
    biliSync: false,
    bannedBVids: [],
    showFavoriteList: false,
  };
};

export const dummyFavListFromList = (list: PlayListDict) => {
  return { ...dummyFavList(''), ...list };
};

export const dummyFavFavList = () => {
  const favfavlist = dummyFavList('我的最爱');
  favfavlist.info.id = 'FavList-Special-Favorite';
  return favfavlist;
};

export const DEFAULT_SETTING: NoxStorage.PlayerSettingDict = {
  ...DEFAULT_SETTING_BASE,

  playMode: 'shufflePlay',
  defaultPlayMode: 'shufflePlay',
  defaultVolume: 1,
  autoRSSUpdate: false,
  skin: '诺莺nox',
  parseSongName: false,
  keepSearchedSongListWhenPlaying: false,
  settingExportLocation: EXPORT_OPTIONS.LOCAL,
  personalCloudIP: '',
  noxVersion: chrome.runtime.getManifest().version,
  hideCoverInMobile: false,
  loadPlaylistAsArtist: false,
  sendBiliHeartbeat: false,
  noCookieBiliSearch: false,
  fastBiliSearch: true,
};

/**
 * wrapper for chrome.storage.local.get. return the
 * local stored objects given a key.
 * @param {string} key
 * @returns
 */
export const readLocalStorage = async (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
};

export const readLocalStorages = async (keys: Array<string>): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result);
    });
  });
};

export const setLocalStorage = async (key: string, val: object | string) => {
  chrome.storage.local.set({ [key]: val });
};

export const saveFav = async (updatedToList: PlayListDict) => {
  return await chrome.storage.local.set({
    [updatedToList.info.id]: updatedToList,
  });
};

export const clearStorage = async () => {
  chrome.storage.local.clear();
};

/**
 * wrapper for getting the current playerSetting.
 * if setting is not initialized, initialize and return the default one.
 * @returns playerSetting
 */
export const getPlayerSetting =
  async (): Promise<NoxStorage.PlayerSettingDict> => {
    const settings = (await readLocalStorage(
      PLAYER_SETTINGS,
    )) as NoxStorage.PlayerSettingDict;
    // console.log(settings)
    if (settings === undefined) {
      return DEFAULT_SETTING;
    }
    return settings;
  };

/**
 * wrapper for getting the current playerSetting's value given a key.
 * if key doesnt exist (an older version?) then return the default value.
 * @param {string} key
 * @returns value in playerSetting
 */
export const getPlayerSettingKey = async (
  key: string | undefined = undefined,
) => {
  const settings = (await getPlayerSetting())!;
  if (key === undefined) {
    return settings;
  }
  // eslint-disable-next-line no-prototype-builtins
  if (settings.hasOwnProperty(key)) {
    return settings[key];
  }
  return DEFAULT_SETTING[key];
};

export const saveMyFavList = (
  newList: PlayListDict,
  callbackFunc = () => {
    console.debug('saveMyFavList called.');
  },
) => {
  chrome.storage.local.set(
    { [MY_FAV_LIST_KEY]: newList.map((v: PlayListDict) => v.info.id) },
    callbackFunc,
  );
};
