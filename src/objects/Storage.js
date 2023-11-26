/* eslint-disable class-methods-use-this */
import { strToU8, strFromU8, compressSync, decompressSync } from 'fflate';

import biliseriesFetch from '@APM/utils/mediafetch/biliseries';
import { dummyFavList, dummyFavFavList } from '@objects/Playlist';
import {
  INITIAL_PLAYLIST,
  MY_FAV_LIST_KEY,
  FAV_FAV_LIST_KEY,
  LYRIC_MAPPING,
  LAST_PLAY_LIST,
  PLAYER_SETTINGS,
  CURRENT_PLAYING,
  DEFAULT_SETTING,
} from '@objects/Storage2';
import { setLocalStorage } from '../utils/ChromeStorage';

export default class StorageManager {
  constructor() {
    this.setFavLists = () => {};
    this.setPlayerSettingInst = () => {};
    this.latestFavLists = [];
  }

  async initFavLists() {
    const _self = this;
    chrome.storage.local.get([MY_FAV_LIST_KEY], (result) => {
      if (Object.keys(result).length !== 0) {
        _self.initWithStorage(result[MY_FAV_LIST_KEY]);
      } else {
        chrome.storage.local.set({ [MY_FAV_LIST_KEY]: [] }, async () => {
          _self.initWithDefault();
          window.open('https://www.bilibili.com/video/BV1bv4y1p7K4/');
        });
      }
    });
  }

  async initWithStorage(FavListIDs) {
    const _self = this;
    chrome.storage.local.get(FavListIDs, (result) => {
      const FavListsSorted = [];
      // Sort result base on ID
      const FavLists = Object.entries(result).map((v) => v[1]);
      FavListIDs.forEach((id) =>
        FavListsSorted.push(FavLists.find((v) => v.info.id === id)),
      );
      _self.setFavLists(FavListsSorted);
      _self.latestFavLists = FavListsSorted;
    });
  }

  async initWithDefault() {
    const _self = this;
    setLocalStorage(FAV_FAV_LIST_KEY, dummyFavFavList());
    const value = dummyFavList('闹闹的歌切');
    value.songList = await biliseriesFetch.regexFetch({
      reExtracted: [0, INITIAL_PLAYLIST[0], INITIAL_PLAYLIST[1]],
    });
    value.subscribeUrls = [
      'https://space.bilibili.com/5053504/channel/seriesdetail?sid=2664851',
    ];
    chrome.storage.local.set(
      {
        [value.info.id]: value,
        [LAST_PLAY_LIST]: [],
        [LYRIC_MAPPING]: [],
        [CURRENT_PLAYING]: { cid: null, playUrl: null },
      },
      () => {
        // console.log('key is set to ' + value.info.id);
        // console.log('Value is set to ' + value);
        chrome.storage.local.set({ [MY_FAV_LIST_KEY]: [value.info.id] }, () => {
          _self.setFavLists([value]);
          _self.latestFavLists = [value];
        });
      },
    );
  }

  deletFavList(id, newFavLists) {
    const _self = this;
    chrome.storage.local.remove(id, () => {
      const newFavListsIds = newFavLists.map((v) => v.info.id);
      chrome.storage.local.set({ [MY_FAV_LIST_KEY]: newFavListsIds }, () => {
        _self.setFavLists(newFavLists);
        _self.latestFavLists = newFavLists;
      });
    });
  }

  addFavList(favName) {
    const _self = this;
    const value = dummyFavList(favName);
    chrome.storage.local.set({ [value.info.id]: value }, () => {
      _self.latestFavLists.push(value);
      _self.saveMyFavList(_self.latestFavLists, () => {
        _self.setFavLists([..._self.latestFavLists]);

        // console.log('AddedFav ' + value.info.id);
      });
    });
    return value;
  }

  saveMyFavList(
    newList,
    callbackFunc = () => {
      console.debug('saveMyFavList called.');
    },
  ) {
    const _self = this;
    _self.latestFavLists = newList;
    chrome.storage.local.set(
      { [MY_FAV_LIST_KEY]: newList.map((v) => v.info.id) },
      callbackFunc,
    );
  }

  updateFavList(updatedToList) {
    const _self = this;
    console.debug('saving favList', updatedToList.info.title);
    switch (updatedToList.info.id) {
      case FAV_FAV_LIST_KEY:
        setLocalStorage(FAV_FAV_LIST_KEY, updatedToList);
        return;
      default:
    }
    chrome.storage.local.set({ [updatedToList.info.id]: updatedToList }, () => {
      const index = _self.latestFavLists.findIndex(
        (f) => f.info.id === updatedToList.info.id,
      );
      _self.latestFavLists[index].songList = updatedToList.songList;
      if (updatedToList.subscribeUrls) {
        _self.latestFavLists[index].subscribeUrls = updatedToList.subscribeUrls;
      }
      _self.setFavLists([..._self.latestFavLists]);
    });
  }

  setLastPlayList(audioLists) {
    chrome.storage.local.set({ [LAST_PLAY_LIST]: audioLists });
  }

  setCurrentPlaying(cid, musicSrc) {
    chrome.storage.local.set({ [CURRENT_PLAYING]: { cid, playUrl: musicSrc } });
  }

  async setLyricOffset(songId, lrcOffset) {
    const lyricMappings = await this.readLocalStorage(LYRIC_MAPPING);
    const detailIndex = lyricMappings.findIndex((l) => l.id === songId);
    if (detailIndex !== -1) {
      lyricMappings[detailIndex].lrcOffset = lrcOffset;
      chrome.storage.local.set({ [LYRIC_MAPPING]: lyricMappings });
    }
  }

  async setLyricDetail(songId, lrc) {
    const lyricMappings = await this.readLocalStorage(LYRIC_MAPPING);
    const detailIndex = lyricMappings.findIndex((l) => l.id === songId);
    if (detailIndex !== -1) {
      lyricMappings[detailIndex].lrc = lrc;
    } else {
      lyricMappings.push({
        key: songId,
        id: songId,
        lrc,
        lrcOffset: 0,
      });
    }
    chrome.storage.local.set({ [LYRIC_MAPPING]: lyricMappings });
  }

  async getLyricDetail(songId) {
    const lyricMappings = await this.readLocalStorage(LYRIC_MAPPING);
    const detail = lyricMappings.find((l) => l.id === songId);
    return detail;
  }

  async readLocalStorage(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  }

  async getKey(key, defaultVal = undefined, setVal = undefined) {
    let val = await this.readLocalStorage(key);
    if (val === undefined && defaultVal !== undefined) {
      val = defaultVal();
      if (setVal === undefined) {
        setLocalStorage(key, val);
      } else {
        setVal(val);
      }
    }
    return val;
  }

  async getFavFavList() {
    return this.getKey(FAV_FAV_LIST_KEY, dummyFavFavList);
  }

  async getPlayerSetting() {
    // return this.getKey(PLAYER_SETTINGS, () => DEFAULT_SETTING, this.setPlayerSetting)
    const settings = await this.readLocalStorage(PLAYER_SETTINGS);
    // console.log(settings)
    if (settings === undefined) {
      this.setPlayerSetting(DEFAULT_SETTING);
      return DEFAULT_SETTING;
    }
    return settings;
  }

  async setPlayerSetting(newSettings) {
    chrome.storage.local.set({ [PLAYER_SETTINGS]: newSettings });
    this.setPlayerSettingInst(newSettings);
  }

  async exportStorageRaw() {
    const items = await chrome.storage.local.get(null);
    return compressSync(strToU8(JSON.stringify(items)));
  }

  async exportStorage() {
    this.exportStorageRaw().then((bytes) => {
      const blob = new Blob([bytes], {
        type: 'application/json;charset=utf-8',
      });
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `noxplay_${new Date()
        .toISOString()
        .slice(0, 10)}.noxBackup`;
      document.body.appendChild(link);
      link.click();
    });
  }

  async clearPlaylists() {
    const playlists = (await chrome.storage.local.get([MY_FAV_LIST_KEY]))[
      MY_FAV_LIST_KEY
    ];
    chrome.storage.local.remove(playlists);
  }

  async importStorageRaw(content) {
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
      await this.clearPlaylists();
      await chrome.storage.local.set({ [MY_FAV_LIST_KEY]: playlists });
      for (const playlistID of playlists) {
        const playlist = JSON.parse(parsedContentDict[playlistID]);
        console.debug(playlist);
        chrome.storage.local.set({
          [playlist.id]: {
            songList: playlist.songList.reduce(
              (acc, curr) => acc.concat(JSON.parse(parsedContentDict[curr])),
              [],
            ),
            info: { title: playlist.title, id: playlist.id },
            subscribeUrls: playlist.subscribeUrl,
            settings: {
              autoRSSUpdate: playlist.subscribeUrl.length > 0,
            },
            useBiliShazam: playlist.useBiliShazam,
            biliSync: false,
            bannedBVids: playlist.blacklistedUrl,
            showFavoriteList: false,
          },
        });
      }
    } else {
      await chrome.storage.local.clear();
      await chrome.storage.local.set(parsedContent);
    }
    this.initFavLists();
  }

  async importStorage() {
    const _self = this;
    const upload = document.createElement('input');
    upload.type = 'file';
    document.body.appendChild(upload);

    upload.addEventListener('change', handleFiles, false);
    function handleFiles() {
      const fileReader = new FileReader();
      fileReader.onload = function () {
        _self.importStorageRaw(new Uint8Array(fileReader.result));
      };
      fileReader.readAsArrayBuffer(this.files[0]);
    }
    upload.click();
  }
}
