import { strFromU8, decompressSync } from 'fflate';

import { StorageKeys, StoragePlaceholders } from '@enums/Storage';
import { DefaultSetting } from '@objects/Storage';
import {
  initPlayerObject,
  getSettings,
  clearPlaylists,
  savePlaylistIds,
} from '@APM/utils/ChromeStorage';
import { importSQL } from '@APM/utils/db/sqlStorage';
import { getItem, savePlaylist, saveItem } from './ChromeStorageAPI';

export * from '@APM/utils/ChromeStorage';

export const saveCustomSkin = (skin: any) =>
  saveItem(StorageKeys.SKINSTORAGE, skin);

export const getCustomSkin = () => getItem(StorageKeys.SKINSTORAGE);

export const getPlaylistIds = (): Promise<string[]> =>
  getItem(StorageKeys.MY_FAV_LIST_KEY, []);

export const saveFav = (updatedToList: NoxMedia.Playlist) =>
  chrome.storage.local.set({
    [updatedToList.id]: updatedToList,
  });

export const clearStorage = () => chrome.storage.local.clear();

/**
 * wrapper for getting the current playerSetting's value given a key.
 * if key doesnt exist (an older version?) then return the default value.
 * @param {string} key
 * @returns value in playerSetting
 */
export const getPlayerSettingKey = async (
  key: string | undefined = undefined,
) => {
  const settings = (await getSettings())!;
  if (key === undefined) {
    return settings;
  }
  // eslint-disable-next-line no-prototype-builtins
  if (settings.hasOwnProperty(key)) {
    return settings[key];
  }
  return DefaultSetting[key];
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
    await clearStorage();
    await importSQL(parsedContent[StorageKeys.SQL_PLACEHOLDER]);
    StoragePlaceholders.forEach((placeholder) => {
      parsedContent[placeholder] = '';
    });
    await chrome.storage.local.set(parsedContent);
  }
  return initPlayerObject();
};
