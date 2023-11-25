import type { NoxStorage } from '@APM/types/storage';
import { STORAGE_KEYS } from '@enums/Storage';
import { DEFAULT_SETTING, MY_FAV_LIST_KEY } from '@objects/Storage2';

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
    { [MY_FAV_LIST_KEY]: newList.map((v: PlayListDict) => v.info.id) },
    callbackFunc,
  );
};
