import { strToU8, compressSync } from 'fflate';

import { logger } from '@utils/Logger';
// eslint-disable-next-line import/extensions
import rejson from '@APM/utils/rejson.json';

export const SongListSuffix = '-songList';

export const saveItem = (key: string, val: object | string | number) =>
  chrome.storage.local.set({ [key]: val });

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
      resolve(result[key] === undefined ? defaultVal : result[key]);
    });
  });
};

export const removeItem = (key: string) => chrome.storage.local.remove(key);

export const saveSecure = saveItem;

export const getSecure = getItem;

export const savePlaylist = (
  playlist: NoxMedia.Playlist,
  overrideKey: string | null = null,
) => {
  const key = overrideKey || playlist.id;
  saveItem(key, { ...playlist, songList: [] });
  saveItem(`${key}${SongListSuffix}`, playlist.songList);
};

export const delPlaylist = (playlistId: string) =>
  Promise.all([
    removeItem(playlistId),
    removeItem(`${playlistId}${SongListSuffix}`),
  ]);

export const exportPlayerContent = async () => {
  const items = await chrome.storage.local.get(null);
  return compressSync(strToU8(JSON.stringify(items)));
};

export const saveChucked = async (key: string, objects: any[]) => [
  await saveItem(key, objects),
];

export const loadChucked = async (keys: string[]) => keys;

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

export const clearStorage = () => chrome.storage.local.clear();

export const getDefaultTheme = () => ({});

export const getColorScheme = () => undefined;

export const getPlaylistSongList = (
  playlist?: NoxMedia.Playlist,
): Promise<NoxMedia.Song[]> => getItem(`${playlist?.id}${SongListSuffix}`, []);

export const getMapping = async (
  key: string,
  transform: (v: any) => any = (v) => v,
) => transform(await getItem(key, {}));

export const importPlayerContentRaw = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _a: any = undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _b: any = undefined,
) => [];
