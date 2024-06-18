import { SyncOptions } from '@APM/enums/Storage';
import { DefaultSetting as _DefaultSetting } from '@APM/objects/Storage';

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
  memoryEfficiency: true,
};

export const OverrideSetting = {
  // memoryEfficiency: false,
};
