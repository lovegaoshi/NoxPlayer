import { 
    fetchVideoInfo, 
    fetchPlayUrlPromise, 
    fetchFavList, 
    fetchBiliSeriesList, 
    fetchBiliColleList, 
    fetchBiliChannelList, 
    fetchBiliSearchList,
    fetchAudioInfoRaw as fetchAudioInfo,
    fetchVideoTagPromise,
 } from '../utils/Data'
import Song, { setSongBiliShazamed } from '../objects/Song'

const DEFAULT_BVID = 'BV1g34y1r71w'
const LAST_PLAY_LIST = 'LastPlayList'

/**
 * uses the bilibili tag API to acquire bilibili shazamed results to a video.
 * @param {string} bvid must provide.
 * @param {string} name must provide.
 * @param {string} cid must provide.
 * @returns 
 */
export const getBiliShazamedSongname = async (info) => {
    return fetchVideoTagPromise({ bvid: info.bvid, cid: info.cid, name: info.name });
    // wanna implement some logic for 王胡桃？
    if (!isNaN(Number(info.name))) {
        // 
        const name = await fetchVideoTagPromise({bvid: info.bvid, cid: info.cid});
        if (name !== null) return name;
    }
    return info.name;
}
/**
 * uses the bilibili tag API to acquire bilibili shazamed results to a list of videos.
 * @param {Array} songlist 
 * @param {boolean} forced 
 * @returns 
 */
export const BiliShazamOnSonglist = async (songlist, forced = false) => {
    let promises = [];
    for (let song of songlist) {
        if (song.biliShazamedName === undefined || forced) {
            promises.push(
                getBiliShazamedSongname({bvid: song.bvid, cid: song.id, name: song.name})
                .then(val => setSongBiliShazamed(song, val)));
        }
    }
    await Promise.all(promises);
    return songlist;
}

// Load last-playist from storage, else use DEFAULT_BVID as initial list.
export const initSongList = async (setCurrentSongList) => {
    chrome.storage.local.get([LAST_PLAY_LIST], async function (result) {
        if (result[LAST_PLAY_LIST] && result[LAST_PLAY_LIST].length != 0) {
            // console.log(result)
            const defaultSongList = result[LAST_PLAY_LIST]
            defaultSongList.map(v => v['musicSrc'] = () => { return fetchPlayUrlPromise(v.bvid, v.id) })
            setCurrentSongList(defaultSongList)
        }
        else {
            const defaultSongList = await getSongList(DEFAULT_BVID)
            setCurrentSongList(defaultSongList)
        }
    })
}

export const getSongList = async (bvid) => {
    const info = await fetchVideoInfo(bvid)
    let lrc = ""
    let songs = []

    // Case of single part video
    if (info.pages.length == 1) {
        // lrc = await fetchLRC(info.title)
        return ([new Song({
            cid: info.pages[0].cid,
            bvid: bvid,
            name: info.title, //await getBiliShazamedSongname({name: info.title, bvid: bvid, cid: info.pages[0].cid}),//
            singer: info.uploader.name,
            singerId: info.uploader.mid,
            cover: info.picSrc,
            musicSrc: () => { return fetchPlayUrlPromise(bvid, info.pages[0].cid) },
            lyric: lrc
        })])
    }

    // Can't use forEach, does not support await
    for (let index = 0; index < info.pages.length; index++) {
        let page = info.pages[index]
        // lrc = fetchLRC(page.part)
        songs.push(new Song({
            cid: page.cid,
            bvid: bvid,
            name: page.part, //await getBiliShazamedSongname({name: page.part, bvid: bvid, cid: page.cid}),//
            singer: info.uploader.name,
            singerId: info.uploader.mid,
            cover: info.picSrc,
            musicSrc: () => { return fetchPlayUrlPromise(bvid, page.cid) },
            lyric: lrc
        }))
    }

    return (songs)
}

export const getSongListFromAudio = async (bvid) => {
    const info = await fetchAudioInfo(bvid)
    let lrc = ""
    let songs = []

    // Case of single part video
    if (info.pages.length == 1) {
        // lrc = await fetchLRC(info.title)
        return ([new Song({
            cid: info.pages[0].cid,
            bvid: bvid,
            name: info.title,
            singer: info.uploader.name,
            singerId: info.uploader.mid,
            cover: info.picSrc,
            musicSrc: () => { return fetchPlayUrlPromise(bvid, info.pages[0].cid) },
            lyric: lrc
        })])
    }

    // Can't use forEach, does not support await
    for (let index = 0; index < info.pages.length; index++) {
        let page = info.pages[index]
        // lrc = fetchLRC(page.part)
        songs.push(new Song({
            cid: page.cid,
            bvid: bvid,
            name: page.part,
            singer: info.uploader.name,
            singerId: info.uploader.mid,
            cover: info.picSrc,
            musicSrc: () => { return fetchPlayUrlPromise(bvid, page.cid) },
            lyric: lrc
        }))
    }

    return (songs)
}

const parseFavList = (favList) => {
    let favListBVid = []
    
    for (let i=0, n=favList.length; i < n; i++) {
        favListBVid.push(favList[i].bvid)
    }

    return favListBVid
}

export const getSongsFromBVids = async ({ infos, useBiliTag = false }) => {

    let songs = []
    for (const info of infos) {
        if(!info)
            return
        // Case of single part video
        if (info.pages.length == 1) {
            // lrc = await fetchLRC(info.title)
            songs.push(new Song({
                cid: info.pages[0].cid,
                bvid: info.pages[0].bvid,
                // this is stupidly slow because each of this async has to be awaited in a sync constructor?!
                name: useBiliTag ? await getBiliShazamedSongname({name: info.title, bvid: info.pages[0].bvid, cid: info.pages[0].cid}) : info.title,
                singer: info.uploader.name,
                singerId: info.uploader.mid,
                cover: info.picSrc,
                musicSrc: () => { return fetchPlayUrlPromise(info.pages[0].bvid, info.pages[0].cid) }
            }))
        }
        else {
            // Can't use forEach, does not support await
            for (let index = 0; index < info.pages.length; index++) {
                let page = info.pages[index]
                    // lrc = fetchLRC(page.part)
                songs.push(new Song({
                    cid: page.cid,
                    bvid: page.bvid,
                    name: useBiliTag? await getBiliShazamedSongname({name: page.part, bvid: page.bvid, cid: page.cid}) : page.part,
                    singer: info.uploader.name,
                    singerId: info.uploader.mid,
                    cover: info.picSrc,
                    musicSrc: () => { return fetchPlayUrlPromise(page.bvid, page.cid) }

                }))
            }
        }
    }

    return (songs)
}

export const getSongsFromSteriaPlayer = async (infos) => {
    // https://steria.vplayer.tk/api/musics/1
    let songs = []

    infos.forEach(info => {
        if(!info)
            return
        // Case of single part video
        for (let index = 0, n = info.data.length; index < n; index++) {
            songs.push(new Song({
                cid: info.data[index].id,
                bvid: info.data[index].id,
                name: info.data[index].name,
                singer: info.data[index].artist,
                singerId: info.data[index].artist,
                cover: "https://i2.hdslb.com/bfs/face/b70f6e62e4582d4fa5d48d86047e64eb57d7504e.jpg@240w_240h_1c_1s.webp",
                musicSrc: () => { return info.data[index].url }
            }))
        }
    })

    return (songs)
}

export const getBiliSeriesList = async ({ mid, sid, progressEmitter = (res) => {}, favList = [], useBiliTag = false, }) => {
    return getSongsFromBVids({ infos: await fetchBiliSeriesList(mid, sid, progressEmitter, parseFavList(favList)), useBiliTag })
}

export const getFavList = async ({ mid, progressEmitter = (res) => {}, favList = [], useBiliTag = false, }) => {
    return getSongsFromBVids({ infos: await fetchFavList(mid, progressEmitter, parseFavList(favList)), useBiliTag })
}

export const getBiliColleList = async ({ mid, sid, progressEmitter = (res) => {}, favList = [], useBiliTag = false, }) => {
    return getSongsFromBVids({ infos: await fetchBiliColleList(mid, sid, progressEmitter, parseFavList(favList)), useBiliTag })
}

export const getBiliChannelList = async ({ mid, progressEmitter = (res) => {}, favList = [], useBiliTag = false, }) => {
    return getSongsFromBVids({ infos: await fetchBiliChannelList(mid, progressEmitter, parseFavList(favList)), useBiliTag })
}

export const getBilSearchList = async ({ mid, progressEmitter = (res) => {}, useBiliTag = false, }) => {
    return getSongsFromBVids({ infos: await fetchBiliSearchList(mid, progressEmitter), useBiliTag })
}
