import {
  DefaultSetting as _DefaultSetting,
  SyncOptions,
} from '@APM/enums/Storage';

export { SyncOptions } from '@APM/enums/Storage';

export const INITIAL_PLAYLIST = ['5053504', '2664851'];

export const DefaultSetting: NoxStorage.PlayerSettingDict = {
  ..._DefaultSetting,

  playMode: 'shufflePlay',
  defaultPlayMode: 'shufflePlay',
  defaultVolume: 1,
  autoRSSUpdate: false,
  skin: '诺莺nox',
  parseSongName: false,
  keepSearchedSongListWhenPlaying: false,
  settingExportLocation: SyncOptions.LOCAL,
  personalCloudIP: '',
  noxVersion: chrome.runtime.getManifest().version,
  hideCoverInMobile: false,
  loadPlaylistAsArtist: false,
  sendBiliHeartbeat: false,
  noCookieBiliSearch: false,
  fastBiliSearch: true,
};

export const NPOverwriteSetting = {
  // memoryEfficiency: false,
};
