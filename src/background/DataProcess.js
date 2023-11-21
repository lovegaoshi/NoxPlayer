import { biliShazamOnSonglist } from '@APM/utils/mediafetch/bilishazam';
import {
  fetchVideoInfo,
  fetchPlayUrlPromise,
  fetchBiliSeriesList,
  fetchiliBVIDs,
} from '../utils/Data';
import Song from '../objects/Song';
import { readLocalStorage } from '../utils/ChromeStorage';

const DEFAULT_BVID = 'BV1g34y1r71w';
const LAST_PLAY_LIST = 'LastPlayList';

export const getSongList = async ({ bvid, useBiliTag = false }) => {
  const info = await fetchVideoInfo(bvid);
  const lrc = '';
  const songs = [];

  // Case of single part video
  if (info.pages.length === 1) {
    // lrc = await fetchLRC(info.title)
    return [
      Song({
        cid: info.pages[0].cid,
        bvid,
        name: info.title,
        singer: info.uploader.name,
        singerId: info.uploader.mid,
        cover: info.picSrc,
        musicSrc: () => {
          return fetchPlayUrlPromise(bvid, info.pages[0].cid);
        },
        lyric: lrc,
        page: 1,
      }),
    ];
  }

  // Can't use forEach, does not support await
  for (let index = 0; index < info.pages.length; index++) {
    const page = info.pages[index];
    // lrc = fetchLRC(page.part)
    songs.push(
      Song({
        cid: page.cid,
        bvid,
        name: page.part,
        singer: info.uploader.name,
        singerId: info.uploader.mid,
        cover: info.picSrc,
        musicSrc: () => {
          return fetchPlayUrlPromise(bvid, page.cid);
        },
        lyric: lrc,
        page: index + 1,
      }),
    );
  }
  if (useBiliTag) return await biliShazamOnSonglist(songs);
  return songs;
};

// Load last-playist from storage, else use DEFAULT_BVID as initial list.
export const initSongList = async (setCurrentSongList) => {
  const result = await readLocalStorage(LAST_PLAY_LIST);
  if (result && result.length !== 0) {
    // console.log(result)
    const defaultSongList = result;
    setCurrentSongList(defaultSongList);
  } else {
    const defaultSongList = await getSongList({ bvid: DEFAULT_BVID });
    setCurrentSongList(defaultSongList);
  }
};

export const getSongsFromBVids = async ({ infos, useBiliTag = false }) => {
  const songs = [];
  for (const info of infos) {
    if (!info) {
      return;
    }
    // Case of single part video
    if (info.pages.length === 1) {
      // lrc = await fetchLRC(info.title)
      songs.push(
        Song({
          cid: info.pages[0].cid,
          bvid: info.pages[0].bvid,
          // this is stupidly slow because each of this async has to be awaited in a sync constructor?!
          name: info.title,
          singer: info.uploader.name,
          singerId: info.uploader.mid,
          cover: info.picSrc,
          musicSrc: () => {
            return fetchPlayUrlPromise(info.pages[0].bvid, info.pages[0].cid);
          },
          page: 1,
        }),
      );
    } else {
      // Can't use forEach, does not support await
      for (let index = 0; index < info.pages.length; index++) {
        const page = info.pages[index];
        // lrc = fetchLRC(page.part)
        songs.push(
          Song({
            cid: page.cid,
            bvid: page.bvid,
            name: page.part,
            singer: info.uploader.name,
            singerId: info.uploader.mid,
            cover: info.picSrc,
            musicSrc: () => {
              return fetchPlayUrlPromise(page.bvid, page.cid);
            },
            page: index + 1,
          }),
        );
      }
    }
  }
  if (useBiliTag) return await biliShazamOnSonglist(songs);
  return songs;
};

export const getBiliSeriesList = async ({
  mid,
  sid,
  progressEmitter = (res) => {},
  favList = [],
  useBiliTag = false,
}) => {
  return getSongsFromBVids({
    infos: await fetchBiliSeriesList(mid, sid, progressEmitter, favList),
    useBiliTag,
  });
};

export const getBVIDList = async ({
  bvids,
  progressEmitter = (res) => {},
  favList = [],
  useBiliTag = false,
}) => {
  return getSongsFromBVids({
    infos: await fetchiliBVIDs(bvids, progressEmitter, favList),
    useBiliTag,
  });
};
