import { v4 as uuidv4 } from 'uuid';

// https://space.bilibili.com/5053504/channel/seriesdetail?sid=2664851
export const INITIAL_PLAYLIST = ['5053504', '2664851'];
export const MY_FAV_LIST_KEY = 'MyFavList';
export const FAV_FAV_LIST_KEY = 'FavFavList-Special';
export const LYRIC_MAPPING = 'LyricMappings';
export const LAST_PLAY_LIST = 'LastPlayList';
export const PLAYER_SETTINGS = 'PlayerSetting';
export const CURRENT_PLAYING = 'CurrentPlaying';
export const FAVLIST_AUTO_UPDATE_TIMESTAMP = 'favListAutoUpdateTimestamp';

export const EXPORT_OPTIONS = {
  local: '本地',
  dropbox: 'Dropbox',
  personal: '私有云',
};

export const dummyFavList = (favName) => {
  return {
    songList: [],
    info: { title: favName, id: (`FavList-${uuidv4()}`) },
    // this is not a Set because we need to serialize this
    // for importing/exporting playlists.
    subscribeUrls: [],
    settings: {
      autoRSSUpdate: false,
    },
    useBiliShazam: false,
    bannedBVids: [],
    showFavoriteList: false,
  };
};

export const dummyFavListFromList = (list) => {
  const newList = dummyFavList('');
  for (const [key, val] of Object.entries(list)) {
    newList[key] = val;
  }
  return newList;
};

export const dummyFavFavList = () => {
  const favfavlist = dummyFavList('我的最爱');
  favfavlist.info.id = 'FavList-Special-Favorite';
  return favfavlist;
};

export const DEFAULT_SETTING = {
  playMode: 'shufflePlay',
  defaultPlayMode: 'shufflePlay',
  defaultVolume: 1,
  autoRSSUpdate: false,
  skin: '诺莺nox',
  parseSongName: false,
  keepSearchedSongListWhenPlaying: false,
  settingExportLocation: EXPORT_OPTIONS.local,
  personalCloudIP: '',
  noxVersion: chrome.runtime.getManifest().version,
  hideCoverInMobile: false,
  loadPlaylistAsArtist: false,
  sendBiliHeartbeat: false,
  noCookieBiliSearch: false,
};

/**
 * wrapper for chrome.storage.local.get. return the
 * local stored objects given a key.
 * @param {string} key
 * @returns
 */
export const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
};

export const setLocalStorage = async (key, val) => {
  chrome.storage.local.set({ [key]: val });
};

export const saveFav = async (updatedToList) => {
  return await chrome.storage.local.set({ [updatedToList.info.id]: updatedToList });
};

/**
 * wrapper for getting the current playerSetting.
 * if setting is not initialized, initialize and return the default one.
 * @returns playerSetting
 */
export const getPlayerSetting = async () => {
  const settings = await readLocalStorage(PLAYER_SETTINGS);
  // console.log(settings)
  if (settings === undefined) {
    this.setPlayerSetting(DEFAULT_SETTING);
    return DEFAULT_SETTING;
  }
  return (settings);
};

/**
 * wrapper for getting the current playerSetting's value given a key.
 * if key doesnt exist (an older version?) then return the default value.
 * @param {string} key
 * @returns value in playerSetting
 */
export const getPlayerSettingKey = async (key = null) => {
  const settings = await getPlayerSetting();
  if (key === null) {
    return settings;
  }
  // eslint-disable-next-line no-prototype-builtins
  if (settings.hasOwnProperty(key)) {
    return settings[key];
  }
  return DEFAULT_SETTING[key];
};

export const saveMyFavList = (newList, callbackFunc = () => { console.debug('saveMyFavList called.'); }) => {
  chrome.storage.local.set({ [MY_FAV_LIST_KEY]: newList.map((v) => v.info.id) }, callbackFunc);
};
