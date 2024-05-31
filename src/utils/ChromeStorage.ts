import { strToU8, strFromU8, compressSync, decompressSync } from 'fflate';

import { StorageKeys, SearchOptions } from '@enums/Storage';
import { logger } from '@utils/Logger';
import { PlaylistTypes } from '@enums/Playlist';
import { dummyPlaylist } from '@APM/objects/Playlist';
import { DefaultSetting, NPOverwriteSetting } from '@objects/Storage';
// eslint-disable-next-line import/extensions
import rejson from '@APM/utils/rejson.json';
import { MUSICFREE } from './mediafetch/musicfree';

export const SongListSuffix = '-songList';

export const getMusicFreePlugin = (): MUSICFREE[] => [];

export const saveDefaultSearch = (val: SearchOptions | MUSICFREE) =>
  saveItem(StorageKeys.DEFAULT_SEARCH, val);

const removeItem = (key: string) => chrome.storage.local.remove(key);

export const savePlaylistIds = (val: string[]) =>
  saveItem(StorageKeys.MY_FAV_LIST_KEY, val);

export const getPlaylistIds = (): Promise<string[]> =>
  getItem(StorageKeys.MY_FAV_LIST_KEY, []);

const delPlaylistPromise = (playlistId: string) =>
  Promise.all([
    removeItem(playlistId),
    removeItem(`${playlistId}${SongListSuffix}`),
  ]);
export const delPlaylist = (playlistId: string, playlistIds: string[]) => {
  playlistIds.splice(playlistIds.indexOf(playlistId), 1);
  delPlaylistPromise(playlistId);
  savePlaylistIds(playlistIds);
  return playlistIds;
};

export const savePlaylist = (
  playlist: NoxMedia.Playlist,
  overrideKey: string | null = null,
) => {
  const key = overrideKey || playlist.id;
  saveItem(key, { ...playlist, songList: [] });
  saveItem(`${key}${SongListSuffix}`, playlist.songList);
};

export const savelastPlaylistId = (val: [string, string]) =>
  saveItem(StorageKeys.LAST_PLAY_LIST, val);

export const saveFavPlaylist = (playlist: NoxMedia.Playlist) =>
  savePlaylist(playlist, StorageKeys.FAVORITE_PLAYLIST_KEY);

export const savePlayerSkins = (skins: any[]) =>
  saveItem(StorageKeys.SKINSTORAGE, skins);

export const saveLyricMapping = async (
  lyricMapping: Map<string, NoxMedia.LyricDetail>,
) => saveItem(StorageKeys.LYRIC_MAPPING, Array.from(lyricMapping.entries()));

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
  Number(await getItem(StorageKeys.FADE_INTERVAL, 0));

export const getABMapping = () => getItem(StorageKeys.ABREPEAT_MAPPING, {});

export const saveABMapping = (val: NoxStorage.ABDict) =>
  saveItem(StorageKeys.ABREPEAT_MAPPING, val);

export const getR128GainMapping = (): Promise<NoxStorage.R128Dict> =>
  getItem(StorageKeys.R128GAIN_MAPPING, {});

export const saveR128GainMapping = (val: NoxStorage.R128Dict) =>
  saveItem(StorageKeys.R128GAIN_MAPPING, val);

export const saveSettings = async (setting: NoxStorage.PlayerSettingDict) =>
  saveItem(StorageKeys.PLAYER_SETTING_KEY, setting);

export const getSettings = async (): Promise<NoxStorage.PlayerSettingDict> => ({
  ...DefaultSetting,
  ...((await getItem(StorageKeys.PLAYER_SETTING_KEY)) || {}),
});

/**
 * wrapper for chrome.storage.local.get. return the
 * local stored objects given a key.
 * @param {string} key
 * @returns
 */
export const getItem = (
  key: string,
  defaultVal: unknown = undefined,
): Promise<any> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      if (result[key] === undefined) {
        resolve(defaultVal);
      }
      resolve(result[key]);
    });
  });
};

export const saveItem = (key: string, val: object | string) =>
  chrome.storage.local.set({ [key]: val });

export const saveFav = (updatedToList: NoxMedia.Playlist) =>
  chrome.storage.local.set({
    [updatedToList.id]: updatedToList,
  });

export const clearStorage = () => chrome.storage.local.clear();

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
  return DefaultSetting[key];
};

const clearPlaylists = async () => {
  const playlistIds = await getPlaylistIds();
  savePlaylistIds([]);
  return playlistIds.map(delPlaylistPromise);
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
    const playlistIds: string[] =
      JSON.parse(parsedContentDict[StorageKeys.MY_FAV_LIST_KEY]) || [];
    await clearPlaylists();
    savePlaylistIds(playlistIds);
    playlistIds.forEach((playlistID) => {
      const playlist = JSON.parse(parsedContentDict[playlistID]);
      savePlaylist({
        ...playlist,
        songList: playlist.songList.reduce(
          (acc: NoxMedia.Song[], curr: string) => [
            ...acc,
            ...JSON.parse(parsedContentDict[curr]),
          ],
          [],
        ),
      });
    });
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
  new Map(await getItem(StorageKeys.LYRIC_MAPPING, []));

interface GetPlaylist {
  key: string;
  defaultPlaylist?: () => NoxMedia.Playlist;
  hydrateSongList?: boolean;
}

export const getPlaylist = async ({
  key,
  defaultPlaylist = dummyPlaylist,
  hydrateSongList = true,
}: GetPlaylist): Promise<NoxMedia.Playlist> => ({
  ...defaultPlaylist(),
  ...(await getItem(key)),
  songList: hydrateSongList ? await getItem(`${key}${SongListSuffix}`, []) : [],
  id: key,
});

export const saveLastPlayDuration = (val: number) =>
  saveItem(StorageKeys.LAST_PLAY_DURATION, String(val));

export const initPlayerObject =
  async (): Promise<NoxStorage.PlayerStorageObject> => {
    const lyricMapping = (await getLyricMapping()) || {};
    const settings = {
      ...DefaultSetting,
      ...(await getItem(StorageKeys.PLAYER_SETTING_KEY, {})),
      ...NPOverwriteSetting,
    };
    const searchPlaylist = dummyPlaylist('Search', PlaylistTypes.Search);
    searchPlaylist.id = StorageKeys.SEARCH_PLAYLIST_KEY;
    const playerObject = {
      settings,
      playlistIds: await getPlaylistIds(),
      playlists: {},
      lastPlaylistId: await getItem(StorageKeys.LAST_PLAY_LIST, [
        'NULL',
        'NULL',
      ]),
      searchPlaylist,
      favoriPlaylist: await getPlaylist({
        key: StorageKeys.FAVORITE_PLAYLIST_KEY,
        defaultPlaylist: () =>
          dummyPlaylist('Favorite', PlaylistTypes.Favorite),
      }),
      playbackMode: await getItem(StorageKeys.PLAYMODE_KEY, 'shufflePlay'),
      skin: await getItem(StorageKeys.SKIN, {}),
      skins: [],
      cookies: await getItem(StorageKeys.COOKIES, {}),
      lyricMapping,
      lastPlayDuration: Number(
        await getItem(StorageKeys.LAST_PLAY_DURATION, 0),
      ),
      colorScheme: undefined,
    } as NoxStorage.PlayerStorageObject;

    playerObject.playlists[StorageKeys.SEARCH_PLAYLIST_KEY] =
      playerObject.searchPlaylist;
    playerObject.playlists[StorageKeys.FAVORITE_PLAYLIST_KEY] =
      playerObject.favoriPlaylist;
    const a = new Date();
    await Promise.all(
      playerObject.playlistIds.map(async (id) => {
        const retrievedPlaylist = await getPlaylist({
          key: id,
          hydrateSongList: !settings.memoryEfficiency,
        });
        playerObject.playlists[id] = retrievedPlaylist;
      }),
    );

    const b = new Date();
    console.debug(
      `[perf] loading playlists took ${b.getTime() - a.getTime()}ms`,
    );
    return playerObject;
  };
