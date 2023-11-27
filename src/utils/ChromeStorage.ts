import { strToU8, strFromU8, compressSync, decompressSync } from 'fflate';

import type { NoxStorage } from '@APM/types/storage';
import { STORAGE_KEYS } from '@enums/Storage';
import { DEFAULT_SETTING, MY_FAV_LIST_KEY } from '@objects/Storage2';
import { logger } from '@utils/Logger';
import { PLAYLIST_ENUMS } from '@enums/Playlist';
import { dummyPlaylist } from '@APM/objects/Playlist';
import rejson from './rejson.json';

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

export const getMusicFreePlugin = (): string[] => [];

const removeItem = (key: string) => chrome.storage.local.remove(key);

export const savePlaylistIds = (val: string[]) =>
  saveItem(STORAGE_KEYS.MY_FAV_LIST_KEY, val);

export const delPlaylist = (
  playlist: NoxMedia.Playlist,
  playlistIds: Array<string>,
) => {
  playlistIds.splice(playlistIds.indexOf(playlist.id), 1);
  removeItem(playlist.id);
  savePlaylistIds(playlistIds);
  return playlistIds;
};

export const savePlaylist = (
  playlist: NoxMedia.Playlist,
  overrideKey: string | null = null,
) => saveItem(overrideKey || playlist.id, playlist);

export const savelastPlaylistId = (val: [string, string]) =>
  saveItem(STORAGE_KEYS.LAST_PLAY_LIST, val);

export const saveFavPlaylist = (playlist: NoxMedia.Playlist) =>
  savePlaylist(playlist, STORAGE_KEYS.FAVORITE_PLAYLIST_KEY);

export const savePlayerSkins = async (skins: Array<any>) =>
  saveItem(STORAGE_KEYS.SKINSTORAGE, skins);

export const saveLyricMapping = async (
  lyricMapping: Map<string, NoxMedia.LyricDetail>,
) => saveItem(STORAGE_KEYS.LYRIC_MAPPING, Array.from(lyricMapping.entries()));

export const getRegExtractMapping = async (): Promise<
  NoxRegExt.JSONExtractor[]
> => {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/lovegaoshi/azusa-player-mobile/master/src/utils/rejson.json',
    );
    return await res.json();
  } catch (e) {
    logger.error('failed to load rejson');
    return rejson as NoxRegExt.JSONExtractor[];
  }
};

export const getFadeInterval = async () =>
  Number(await getItem(STORAGE_KEYS.FADE_INTERVAL, 0));

export const getABMapping = () => getItem(STORAGE_KEYS.ABREPEAT_MAPPING, {});

export const saveABMapping = (val: NoxStorage.ABDict) =>
  saveItem(STORAGE_KEYS.ABREPEAT_MAPPING, val);

export const getR128GainMapping = (): Promise<NoxStorage.R128Dict> =>
  getItem(STORAGE_KEYS.R128GAIN_MAPPING, {});

export const saveR128GainMapping = (val: NoxStorage.R128Dict) =>
  saveItem(STORAGE_KEYS.R128GAIN_MAPPING, val);

export const saveSettings = async (setting: NoxStorage.PlayerSettingDict) =>
  saveItem(STORAGE_KEYS.PLAYER_SETTING_KEY, setting);

export const getSettings = async (): Promise<NoxStorage.PlayerSettingDict> => ({
  ...DEFAULT_SETTING,
  ...((await getItem(STORAGE_KEYS.PLAYER_SETTING_KEY)) || {}),
});

/**
 * wrapper for chrome.storage.local.get. return the
 * local stored objects given a key.
 * @param {string} key
 * @returns
 */
export const readLocalStorage = (
  key: string,
  defaultVal: unknown = undefined,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (result[key] === undefined) {
        resolve(defaultVal);
      }
      resolve(result[key]);
    });
  });
};

const getItem = readLocalStorage;

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

const saveItem = setLocalStorage;

export const saveFav = async (updatedToList: PlayListDict) => {
  return await chrome.storage.local.set({
    [updatedToList.id]: updatedToList,
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
export const getPlayerSetting = getSettings;

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
    { [MY_FAV_LIST_KEY]: newList.map((v: PlayListDict) => v.id) },
    callbackFunc,
  );
};

const clearPlaylists = async () => {
  const playlists = (await chrome.storage.local.get([MY_FAV_LIST_KEY]))[
    MY_FAV_LIST_KEY
  ];
  chrome.storage.local.remove(playlists);
};

export const importStorageRaw = async (content: Uint8Array) => {
  const parsedContent = JSON.parse(strFromU8(decompressSync(content)));
  // compatibility from azusa-player-mobile that its an array of key-value pair.
  if (Array.isArray(parsedContent)) {
    console.warn(
      'import playlist is azusamobile variant. now importing just the playlist...',
    );
    const parsedContentDict = parsedContent.reduce(
      (acc, curr) => ({ ...acc, [curr[0]]: curr[1] }),
      {},
    );
    const playlists = JSON.parse(parsedContentDict[MY_FAV_LIST_KEY]) || [];
    await clearPlaylists();
    await chrome.storage.local.set({ [MY_FAV_LIST_KEY]: playlists });
    for (const playlistID of playlists) {
      const playlist = JSON.parse(parsedContentDict[playlistID]);
      console.debug(playlist);
      chrome.storage.local.set({
        [playlist.id]: playlist,
      });
    }
  } else {
    await chrome.storage.local.clear();
    await chrome.storage.local.set(parsedContent);
  }
  return initPlayerObject();
};

export const exportStorageRaw = async () => {
  const items = await chrome.storage.local.get(null);
  return compressSync(strToU8(JSON.stringify(items)));
};

export const getLyricMapping = async () =>
  new Map(await getItem(STORAGE_KEYS.LYRIC_MAPPING, []));

const getPlaylist = async (
  key: string,
  defaultPlaylist: () => NoxMedia.Playlist = dummyPlaylist,
): Promise<NoxMedia.Playlist> => getItem(key, defaultPlaylist());

export const initPlayerObject =
  async (): Promise<NoxStorage.PlayerStorageObject> => {
    const lyricMapping = (await getLyricMapping()) || {};
    const playerObject = {
      settings: {
        ...DEFAULT_SETTING,
        ...(await getItem(STORAGE_KEYS.PLAYER_SETTING_KEY, {})),
      },
      playlistIds: await getItem(STORAGE_KEYS.MY_FAV_LIST_KEY, []),
      playlists: {},
      lastPlaylistId: await getItem(STORAGE_KEYS.LAST_PLAY_LIST, [
        'NULL',
        'NULL',
      ]),
      searchPlaylist: dummyPlaylist(
        'Search',
        PLAYLIST_ENUMS.TYPE_SEARCH_PLAYLIST,
      ),
      favoriPlaylist: await getPlaylist(
        STORAGE_KEYS.FAVORITE_PLAYLIST_KEY,
        () => dummyPlaylist('Favorite', PLAYLIST_ENUMS.TYPE_FAVORI_PLAYLIST),
      ),
      playerRepeat: await getItem(STORAGE_KEYS.PLAYMODE_KEY, 'shufflePlay'),
      skin: await getItem(STORAGE_KEYS.SKIN, {}),
      skins: [],
      cookies: await getItem(STORAGE_KEYS.COOKIES, {}),
      lyricMapping,
      lastPlayDuration: await getItem(STORAGE_KEYS.LAST_PLAY_DURATION, 0),
      colorScheme: [],
    } as NoxStorage.PlayerStorageObject;

    playerObject.playlists[STORAGE_KEYS.SEARCH_PLAYLIST_KEY] =
      playerObject.searchPlaylist;
    playerObject.playlists[STORAGE_KEYS.FAVORITE_PLAYLIST_KEY] =
      playerObject.favoriPlaylist;

    await Promise.all(
      playerObject.playlistIds.map(async (id) => {
        const retrievedPlaylist = await getPlaylist(id);
        if (retrievedPlaylist) playerObject.playlists[id] = retrievedPlaylist;
      }),
    );
    return playerObject;
  };
