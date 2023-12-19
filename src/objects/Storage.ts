import {
  DEFAULT_SETTING as DEFAULT_SETTING_BASE,
  EXPORT_OPTIONS,
} from '@APM/enums/Storage';

export { EXPORT_OPTIONS } from '@APM/enums/Storage';

export const INITIAL_PLAYLIST = ['5053504', '2664851'];

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
