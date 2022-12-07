import { getBiliSeriesList } from '../background/DataProcess'
import { v4 as uuidv4 } from 'uuid';
import { fetchPlayUrlPromise } from '../utils/Data'
// https://space.bilibili.com/5053504/channel/seriesdetail?sid=2664851
const INITIAL_PLAYLIST = ['5053504', '2664851']
const MY_FAV_LIST_KEY = 'MyFavList'
const LYRIC_MAPPING = 'LyricMappings'
const LAST_PLAY_LIST = 'LastPlayList'
const PLAYER_SETTINGS = 'PlayerSetting'

const dummyFavList = (favName) => {
    return {
        songList: [],
        info: { title: favName, id: ('FavList-' + uuidv4()) },
        subscribeUrls: [],
        settings: {
            autoRSSUpdate: false,
        }
    }
}

const defaultSetting = { 
    playMode: 'shufflePlay',
    defaultPlayMode: 'shufflePlay',
    defaultVolume: 1,
}

export default class StorageManager {
    constructor() {
        this.setFavLists = () => { }
        this.latestFavLists = []
    }

    async initFavLists() {
        const _self = this
        chrome.storage.local.get(['MyFavList'], function (result) {
            //console.log(result);
            if (Object.keys(result).length != 0) {
                _self.initWithStorage(result["MyFavList"])
            }
            else {
                chrome.storage.local.set({ 'MyFavList': [] }, async function () {
                    _self.initWithDefault()
                });
            }
        });
    }

    async initWithStorage(FavListIDs) {
        const _self = this
        chrome.storage.local.get(FavListIDs, function (result) {
            let FavLists = []
            let FavListsSorted = []
            // Sort result base on ID
            for (let [key, value] of Object.entries(result)) {
                value.songList.map((v) => v['musicSrc'] = () => { return fetchPlayUrlPromise(v.bvid, v.id) })
                FavLists.push(value)

            }
            FavListIDs.map((id) => {
                FavListsSorted.push(FavLists.find((v) => v.info.id == id))
            })
            //console.log(FavListsSorted)
            _self.setFavLists(FavListsSorted)
            _self.latestFavLists = FavListsSorted
        })
    }

    async initWithDefault() {
        const _self = this
        let value = dummyFavList('闹闹的歌切')
        value.songList = await getBiliSeriesList(INITIAL_PLAYLIST[0], INITIAL_PLAYLIST[1])
        value.subscribeUrls = ['https://space.bilibili.com/5053504/channel/seriesdetail?sid=2664851']
        // const value2 = {
        //     songList: await getSongList('BV1Ya411z7WL'),
        //     info: { title: '默认歌单2', id: ('FavList-' + uuidv4()) }
        // }[value2.info.id]: value2,

        chrome.storage.local.set({
            [value.info.id]: value,
            [LAST_PLAY_LIST]: [],
            [LYRIC_MAPPING]: [],
        }, function () {
            //console.log('key is set to ' + value.info.id);
            //console.log('Value is set to ' + value);
            chrome.storage.local.set({ 'MyFavList': [value.info.id] }, function () {
                _self.setFavLists([value])
                _self.latestFavLists = [value]
            })
        });
    }

    deletFavList(id, newFavLists) {
        const _self = this
        chrome.storage.local.remove(id, function () {
            const newFavListsIds = newFavLists.map(v => v.info.id)
            chrome.storage.local.set({ [MY_FAV_LIST_KEY]: newFavListsIds }, function () {
                _self.setFavLists(newFavLists)
                _self.latestFavLists = newFavLists
            })
        })
    }

    addFavList(favName) {
        const _self = this
        const value = dummyFavList(favName)
        chrome.storage.local.set({ [value.info.id]: value }, function () {
            _self.latestFavLists.push(value)
            _self.saveMyFavList(_self.latestFavLists.map(v => v.info.id), function () {
                _self.setFavLists([..._self.latestFavLists])

                //console.log('AddedFav ' + value.info.id);
            })
        });
        return value
    }

    saveMyFavList(newListIDs, callbackFunc = () => {console.debug('saveMyFavList called.')} ) {
        chrome.storage.local.set({ 'MyFavList': newListIDs }, callbackFunc)
    }

    updateFavList(updatedToList) {
        const _self = this
        console.debug('saving favList', updatedToList.info.title)
        chrome.storage.local.set({ [updatedToList.info.id]: updatedToList }, function () {
            const index = _self.latestFavLists.findIndex(f => f.info.id == updatedToList.info.id)
            _self.latestFavLists[index].songList = updatedToList.songList
            if (updatedToList.subscribeUrls) {
                _self.latestFavLists[index].subscribeUrls = updatedToList.subscribeUrls
                console.debug('saving subscribe url', updatedToList.subscribeUrls)    
            }
            _self.setFavLists([..._self.latestFavLists])
        });
    }

    setLastPlayList(audioLists) {
        chrome.storage.local.set({ [LAST_PLAY_LIST]: audioLists })
    }

    async setLyricOffset(songId, lrcOffset) {
        const lyricMappings = await this.readLocalStorage(LYRIC_MAPPING)
        const detailIndex = lyricMappings.findIndex(l => l.id == songId)
        if (detailIndex != -1) {
            lyricMappings[detailIndex].lrcOffset = lrcOffset
            chrome.storage.local.set({ [LYRIC_MAPPING]: lyricMappings })
        }
    }

    async setLyricDetail(songId, lrc) {
        const lyricMappings = await this.readLocalStorage(LYRIC_MAPPING)
        const detailIndex = lyricMappings.findIndex(l => l.id == songId)
        if (detailIndex != -1) {
            lyricMappings[detailIndex].lrc = lrc
        }
        else {
            lyricMappings.push({ key: songId, id: songId, lrc: lrc, lrcOffset: 0 })
        }
        chrome.storage.local.set({ [LYRIC_MAPPING]: lyricMappings })
    }
    async getLyricDetail(songId) {
        const lyricMappings = await this.readLocalStorage(LYRIC_MAPPING)
        const detail = lyricMappings.find(l => l.id == songId)
        return detail;
    }

    async readLocalStorage(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key], function (result) {
                resolve(result[key]);
            });
        });
    };

    async getPlayerSetting() {
        const settings = await this.readLocalStorage(PLAYER_SETTINGS)
        // console.log('setting1:' + settings)
        if (settings == undefined) {
            this.setPlayerSetting(defaultSetting)
            return defaultSetting
        }
        return (settings)
    }

    async setPlayerSetting(newSettings) {
        chrome.storage.local.set({ [PLAYER_SETTINGS]: newSettings })
    }

    async exportStorage() {
        chrome.storage.local.get(null, function (items) { // null implies all items
            // Convert object to a string.
            let result = JSON.stringify(items);
            const bytes = new TextEncoder().encode(result);
            const blob = new Blob([bytes], {
                type: "application/json;charset=utf-8"
            });

            const href = window.URL.createObjectURL(blob);
            const link = document.createElement('a')
            link.href = href
            link.download = 'AzusaPlayerStorage_' + new Date().toISOString().slice(0, 10) + '.json'
            document.body.appendChild(link)
            link.click()
        });
    }

    async importStorage() {
        const _self = this
        const upload = document.createElement('input')
        upload.type = "file"
        document.body.appendChild(upload)

        upload.addEventListener("change", handleFiles, false);
        function handleFiles() {
            let fileReader = new FileReader();
            fileReader.onload = function () {
                let parsedJSON = JSON.parse(fileReader.result);
                console.log(parsedJSON);
                // your code to consume the json
                chrome.storage.local.clear(() => {
                    chrome.storage.local.set(parsedJSON, () => {
                        _self.initFavLists()
                    })
                })
            }
            fileReader.readAsText(this.files[0]);
        }
        upload.click()
    }
}




