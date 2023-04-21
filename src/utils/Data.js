import Bottleneck from 'bottleneck';
import Youtube from 'youtube-stream-url';
import Logger from './Logger';
import VideoInfo from '../objects/VideoInfo';
import { getPlayerSettingKey } from './ChromeStorage';
import { extractSongName } from './re';
import functionPromiseRetry from './retry';

const logger = new Logger('Data.js');

/**
 * limits to bilibili API call to 200ms/call using bottleneck.
 * 100ms/call seems to brick IP after ~ 400 requests.
 */
const biliApiLimiter = new Bottleneck({
  minTime: 200,
  maxConcurrent: 5,
});

/**
 * limits to bilibili.tag API call to 100ms/call using bottleneck
 * through experiment bilibili.tag seems to be more tolerable
 * than other APIs such as getvideoinfo
 */
const biliTagApiLimiter = new Bottleneck({
  minTime: 100,
  maxConcurrent: 5,
});

/**
 *  Video src info
 */
const URL_PLAY_URL = 'https://api.bilibili.com/x/player/playurl?cid={cid}&bvid={bvid}&qn=64&fnval=16';
/**
 *  API that gets the tag of a video. sometimes bilibili identifies the BGM used.
 * https://api.bilibili.com/x/web-interface/view/detail/tag?bvid=BV1sY411i7jP&cid=1005921247
 */
const URL_VIDEO_TAGS = 'https://api.bilibili.com/x/web-interface/view/detail/tag?bvid={bvid}&cid={cid}';
/**
 *  bilibili API to get an audio's stream src url.
 * https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/audio/musicstream_url.md
 * https://api.bilibili.com/audio/music-service-c/url doesnt work.
 * au must be removed, eg. https://www.bilibili.com/audio/music-service-c/web/url?sid=745350
 */
const URL_AUDIO_PLAY_URL = 'https://www.bilibili.com/audio/music-service-c/web/url?sid={sid}';
/**
 *  BVID -> CID
 */
const URL_BVID_TO_CID = 'https://api.bilibili.com/x/player/pagelist?bvid={bvid}&jsonp=jsonp';
/**
 *  Audio Basic Info
 * https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/audio/info.md
 */
const URL_AUDIO_INFO = 'https://www.bilibili.com/audio/music-service-c/web/song/info?sid={sid}';
/**
 *  Video Basic Info
 */
const URL_VIDEO_INFO = 'http://api.bilibili.com/x/web-interface/view?bvid={bvid}';
/**
 *  channel series API Extract Info
 */
const URL_BILISERIES_INFO = 'https://api.bilibili.com/x/series/archives?mid={mid}&series_id={sid}&only_normal=true&sort=desc&pn={pn}&ps=30';
/**
 *  channel series API Extract Info
 */
const URL_BILICOLLE_INFO = 'https://api.bilibili.com/x/polymer/space/seasons_archives_list?mid={mid}&season_id={sid}&sort_reverse=false&page_num={pn}&page_size=30';
/**
 *  channel API Extract Info
 */
const URL_BILICHANNEL_INFO = 'https://api.bilibili.com/x/space/arc/search?mid={mid}&pn={pn}&jsonp=jsonp';
/**
 *  Fav List
 */
const URL_FAV_LIST = 'https://api.bilibili.com/x/v3/fav/resource/list?media_id={mid}&pn={pn}&ps=20&keyword=&order=mtime&type=0&tid=0&platform=web&jsonp=jsonp';
/**
 *  BILIBILI search API.
 */
const URL_BILI_SEARCH = 'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword={keyword}&page={pn}';
/**
 *  LRC Mapping
 */
const URL_LRC_MAPPING = 'https://raw.githubusercontent.com/kenmingwang/azusa-player-lrcs/main/mappings.txt';
/**
 *  LRC Base
 */
const URL_LRC_BASE = 'https://raw.githubusercontent.com/kenmingwang/azusa-player-lrcs/main/{songFile}';
/**
 *  QQ SongSearch API
 */
const URL_QQ_SEARCH = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?key={KeyWord}';
/**
 *  QQ LyricSearchAPI
 */
const URL_QQ_LYRIC = 'https://i.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid={SongMid}&g_tk=5381&format=json&inCharset=utf8&outCharset=utf-8&nobase64=1';

export const ENUMS = {
  audioType: 'audio',
  youtube: 'youtube.video',
};

/**
 * a parent method that returns the media's stream url given an id.
 * @param {string} bvid media's id.
 * @param {string} cid optional in video; if not provided, bvid is used to fetch cid. note
 * some videos have episodes that this may not be accurate. in other formats (eg biliAudio)
 * its used as an identifier.
 * @returns promise that resolves the media stream url.
 */
export const fetchPlayUrlPromise = async (bvid, cid) => {
  const cidStr = cid.toString();
  if (cidStr.startsWith(ENUMS.audioType)) {
    return fetchAudioPlayUrlPromise(bvid);
  } if (cidStr.startsWith(ENUMS.youtube)) {
    return fetchYoutubePromise(bvid);
  }
  return fetchVideoPlayUrlPromise(bvid, cid);
};

export const fetchYoutubeVideo = async (ytbid) => {
  return Youtube.getInfo({ url: ytbid, throwOnError: true });
};

/**
 * extracts youtube hlp url using library youtube-stream-url
 * https://github.com/dangdungcntt/youtube-stream-url
 * @param {string} ytbid youtube video identifier.
 */
const fetchYoutubePromise = async (ytbid) => {
  const extractedVideoInfo = await fetchYoutubeVideo(ytbid);
  let maxAudioQualityStream = { bitrate: 0 };
  for (const videoStream of extractedVideoInfo.formats) {
    if (videoStream.loudnessDb && videoStream.bitrate > maxAudioQualityStream.bitrate) {
      maxAudioQualityStream = videoStream;
    }
  }
  return maxAudioQualityStream.url;
};

/**
 * returns the bilibili video stream url given a bvid and cid.
 * @param {string} bvid video's bvid. starts with BV.
 * @param {string | undefined} cid optional; if not provided, bvid is used to fetch cid. note
 * some videos have episodes that this may not be accurate.
 * @returns
 */
export const fetchVideoPlayUrlPromise = async (bvid, cid, extractType = 'AudioUrl') => {
  if (!cid) { cid = await fetchCID(bvid).catch((err) => console.log(err)); }

  // Returns a promise that resolves into the audio stream url
  return (new Promise((resolve, reject) => {
    // console.log('Data.js Calling fetchPlayUrl:' + URL_PLAY_URL.replace("{bvid}", bvid).replace("{cid}", cid))
    chrome.storage.local.get(['CurrentPlaying', 'PlayerSetting'], (result) => {
      // To prohibit current playing audio from fetching a new audio stream
      // If single loop, retreive the promise again.
      if (result.CurrentPlaying && result.CurrentPlaying.cid === cid && result.PlayerSetting.playMode === 'singleLoop') {
        // fixed return point; but why when repeat is single loop, a new promise is retrieved?
        resolve(result.CurrentPlaying.playUrl);
      } else {
        fetch(URL_PLAY_URL.replace('{bvid}', bvid).replace('{cid}', cid))
          .then((res) => res.json())
          .then((json) => resolve(extractResponseJson(json, extractType)))
          .catch((err) => reject(console.log(err)));
      }
    });
  }));
};

/**
 * returns the bilibili video stream url given a bvid and cid.
 * @param {string} bvid video's bvid. starts with BV.
 * @param {string} cid optional; if not provided, bvid is used to fetch cid. note
 * some videos have episodes that this may not be accurate.
 * @returns
 */
const fetchVideoTagPromiseRaw = async ({ bvid, cid }) => {
  const req = await fetch(URL_VIDEO_TAGS.replace('{bvid}', bvid).replace('{cid}', cid));
  const json = await req.json();
  try {
    if (json.data[0].tag_type === 'bgm') {
      return json.data[0].tag_name;
    }
    return null;
  } catch (e) {
    console.warn(`fetching videoTag for ${bvid}, ${cid} failed. if ${cid} is a special tag its expected.`, e);
    return null;
  }
};

export const biliAPILimiterWrapper = async (params, func = () => {}, progressEmit = () => {}) => {
  return biliApiLimiter.schedule(() => {
    progressEmit();
    return func(params);
  });
};

export const fetchVideoTagPromise = async ({ bvid, cid }) => {
  return biliTagApiLimiter.schedule(() => fetchVideoTagPromiseRaw({ bvid, cid }));
};

/**
 * returns the bilibili audio stream url given a auid/sid.
 * @param {string} bvid audio's auid. starts with AU. eg.
 * https://www.bilibili.com/audio/au745350
 * @returns
 */
export const fetchAudioPlayUrlPromise = async (sid) => {
  // Returns a promise that resolves into the audio stream url
  return (new Promise((resolve, reject) => {
    // console.log('Data.js Calling fetchPlayUrl:' + URL_PLAY_URL.replace("{bvid}", bvid).replace("{cid}", cid))
    chrome.storage.local.get(['CurrentPlaying', 'PlayerSetting'], (result) => {
      // To prohibit current playing audio from fetching a new audio stream
      // If single loop, retreive the promise again.
      if (result.CurrentPlaying && result.CurrentPlaying.bvid === sid && result.PlayerSetting.playMode === 'singleLoop') {
        // fixed return point; but why when repeat is single loop, a new promise is retrieved?
        resolve(result.CurrentPlaying.playUrl);
      } else {
        fetch(URL_AUDIO_PLAY_URL.replace('{sid}', sid))
          .then((res) => res.json())
          .then((json) => resolve(json.data.cdns[0]))
          .catch((err) => reject(console.log(err)));
      }
    });
  }));
};

/**
 *
 * @param {string} bvid
 * @returns
 */
export const fetchCID = async (bvid) => {
  // console.log('Data.js Calling fetchCID:' + URL_BVID_TO_CID.replace("{bvid}", bvid))
  const res = await fetch(URL_BVID_TO_CID.replace('{bvid}', bvid));
  const json = await res.json();
  const cid = extractResponseJson(json, 'CID');
  return cid;
};

// Refactor needed for this func
export const fetchLRC = async (name, setLyric, setSongTitle) => {
  // console.log('Data.js Calling: fetchLRC')
  // Get song mapping name and song name from title
  const res = await fetch(URL_LRC_MAPPING);
  const mappings = await res.text();
  const songs = mappings.split('\n');
  const songName = extractSongName(name);
  setSongTitle(songName);

  const songFile = songs.find((v, i, a) => v.includes(songName));
  // use song name to get the LRC
  try {
    const lrc = await fetch(URL_LRC_BASE.replace('{songFile}', songFile));
    if (lrc.status !== '200') {
      setLyric('[00:00.000] 无法找到歌词');
      return;
    }

    const text = await lrc.text();
    setLyric(text.replaceAll('\r\n', '\n'));
    return text.replaceAll('\r\n', '\n');
  } catch (error) {
    setLyric('[00:00.000] 无法找到歌词');
  }
};

/**
 *
 * @param {string} bvid
 * @returns
 */
export const fetchVideoInfoRaw = async ({ bvid }) => {
  logger.info('calling fetchVideoInfo');
  const res = await fetch(URL_VIDEO_INFO.replace('{bvid}', bvid));
  const json = await res.json();
  try {
    const { data } = json;
    const v = new VideoInfo(
      data.title,
      data.desc,
      data.videos,
      data.pic,
      data.owner,
      data.pages.map((s) => { return ({ bvid, part: s.part, cid: s.cid }); }),
      bvid,
    );
    return v;
  } catch (error) {
    console.error(error);
    console.warn('Some issue happened when fetching', bvid);
  }
};

/**
 *
 * @param {string} bvid
 * @param {function} progressEmit
 * @returns
 */
export const fetchVideoInfo = async (bvid, progressEmit = () => {}) => {
  return biliAPILimiterWrapper({ bvid }, fetchVideoInfoRaw, progressEmit);
};

/**
 *
 * @param {string} sid sid of the bili audio; note au needs to be removed, this is
 * technically an int.
 * @returns
 */
export const fetchAudioInfoRaw = async (sid) => {
  logger.info('calling fetcAudioInfo');
  const res = await fetch(URL_AUDIO_INFO.replace('{sid}', sid));
  const json = await res.json();
  try {
    const { data } = json;
    const v = new VideoInfo(
      data.title,
      data.intro,
      1,
      data.cover,
      { name: data.uname, mid: data.uid },
      [{ cid: ENUMS.audioType }],
      sid,
    );
    return v;
  } catch (error) {
    console.error(error);
    console.warn('Some issue happened when fetching', bvid);
  }
};

/**
 * fetch biliseries. copied from yt-dlp.
 * unlike other APIs, biliseries API can return all videos in the series by using page number = 0.
 * thus this does not need to use the generic paginated function.
 * @param {string} mid
 * @param {string} sid
 * @param {function} progressEmitter
 * @param {array} favList
 * @returns
 */
export const fetchBiliSeriesList = async (mid, sid, progressEmitter, favList = []) => {
  logger.info('calling fetchBiliSeriesList');
  const page = 0;
  const res = await fetch(URL_BILISERIES_INFO.replace('{mid}', mid).replace('{sid}', sid).replace('{pn}', page));
  const json = await res.json();
  const { data } = json;

  const BVidPromises = [];
  for (let i = 0, n = data.archives.length; i < n; i++) {
    if (favList.includes(data.archives[i].bvid)) {
      console.debug('fetchBiliSeriesList: skipped duplicate bvid during rss feed update', data.archives[i].bvid);
      continue;
    }
    BVidPromises.push(fetchVideoInfo(data.archives[i].bvid, () => { progressEmitter(parseInt(100 * (i + 1) / data.archives.length)); }));
  }
  let videoInfos = [];
  await Promise.all(BVidPromises).then((resp) => videoInfos = resp.filter((item) => item !== undefined));
  return videoInfos;
};

export const fetchiliBVIDs = async (BVids, progressEmitter = () => {}) => {
  const BVidPromises = [];
  for (let index = 0, n = BVids.length; index < n; index++) {
    BVidPromises.push(fetchVideoInfo(BVids[index], () => { progressEmitter(parseInt(100 * (index + 1) / n)); }));
  }
  return await Promise.all(BVidPromises);
};

/**
 * a universal bvid retriever for all bilibili paginated APIs. used to reduce
 * redundant codes in bilibili collection, favlist and channel.
 * @param {string} url
 * @param {function} getMediaCount
 * @param {function} getPageSize
 * @param {function} getItems
 * @param {function} progressEmitter
 * @param {array} favList
 * @returns
 */
export const fetchBiliPaginatedAPI = async (url, getMediaCount, getPageSize, getItems, progressEmitter, favList = []) => {
  const res = await fetch(url.replace('{pn}', 1));
  const json = await res.clone().json();
  const { data } = json;
  const mediaCount = getMediaCount(data);
  const BVids = [];
  const pagesPromises = [res];
  for (let page = 2, n = Math.ceil(mediaCount / getPageSize(data)); page <= n; page++) {
    pagesPromises.push(biliTagApiLimiter.schedule(() => fetch(url.replace('{pn}', page))));
  }
  let videoInfos = [];
  const processedPromises = await Promise.all(pagesPromises);
  for (const pages of processedPromises) {
    try {
      const parsedJson = await pages.json();
      getItems(parsedJson).map((m) => {
        if (!favList.includes(m.bvid)) BVids.push(m.bvid);
        return null;
      });
    } catch {
      console.error(pages);
    }
  }
  // i dont know the smart way to do this out of the async loop, though luckily that O(2n) isnt that big of a deal
  await fetchiliBVIDs(BVids, progressEmitter).then((resp) => videoInfos = resp.filter((item) => item !== undefined));
  return videoInfos;
};

/**
 *
// copied from ytdlp. applies to collections such as:
// https://space.bilibili.com/287837/channel/collectiondetail?sid=793137
 * @param {string} mid
 * @param {string} sid
 * @param {function} progressEmitter
 * @param {array} favList
 * @returns
 */
export const fetchBiliColleList = async (mid, sid, progressEmitter, favList = []) => {
  logger.info('calling fetchBiliColleList');

  return fetchBiliPaginatedAPI(
    URL_BILICOLLE_INFO.replace('{mid}', mid).replace('{sid}', sid),
    (data) => { return data.meta.total; },
    (data) => { return data.page.page_size; },
    (js) => { return js.data.archives; },
    progressEmitter,
    favList,
  );
};

/**
 *
// copied from ytdlp. applies to bibibili channels such as:
// https://space.bilibili.com/355371630/video
 * @param {string} url the actual url. because url may have url search params such as tid,
 * the actual url is needed here for further parsing, instead of simply passing the bili user UID
 * @param {function} progressEmitter
 * @param {array} favList
 * @returns
 */
export const fetchBiliChannelList = async (url, progressEmitter, favList = []) => {
  logger.info('calling fetchBiliChannelList');
  const mid = /.*space.bilibili\.com\/(\d+)\/video.*/.exec(url)[1];
  let searchAPI = URL_BILICHANNEL_INFO.replace('{mid}', mid);
  const urlSearchParam = new URLSearchParams(new URL(url).search);
  if (urlSearchParam.get('tid') !== null) {
    // TODO: do this properly with another URLSearchParams instance
    searchAPI += `&tid=${String(urlSearchParam.get('tid'))}`;
  }
  return fetchBiliPaginatedAPI(
    searchAPI,
    (data) => { return data.page.count; },
    (data) => { return data.page.ps; },
    (js) => { return js.data.list.vlist; },
    progressEmitter,
    favList,
  );
};

/**
 *
 * @param {string} url
 * @param {function} progressEmitter
 * @param {array} favList
 * @returns
 */
export const fetchGenericPaginatedList = async (url, progressEmitter, favList = []) => {
  logger.info('calling fetchGenricPaginatedList');
  const exampleUrl = 'https://steria.vplayer.tk/api/musics/{pn}';
  const res = await fetch(url.replace('{pn}', 1));
  const videoInfos = [await res.json()];

  for (let page = 2; true; page++) {
    videoInfos.push(fetch(url.replace('{pn}', page)).json());
    if (videoInfos[videoInfos.length - 1].length === 0) break;
  }
  await Promise.all(videoInfos);
  return videoInfos;
};

/**
 *
// copied from ytdlp. applies to bibibili fav lists such as:
// https://space.bilibili.com/355371630/video
 * @param {string} mid
 * @param {function} progressEmitter
 * @param {array} favList
 * @returns
 */
export const fetchFavList = async (mid, progressEmitter, favList = []) => {
  logger.info('calling fetchFavList');

  return fetchBiliPaginatedAPI(
    URL_FAV_LIST.replace('{mid}', mid),
    (data) => { return data.info.media_count; },
    (data) => { return 20; },
    (js) => { return js.data.medias; },
    progressEmitter,
    favList,
  );
};

/**
 *
// copied from ytdlp. applies to bibibili fav lists such as:
// https://space.bilibili.com/355371630/video
 * @param {string} mid
 * @param {function} progressEmitter
 * @param {array} favList
 * @returns
 */
export const fetchBiliSearchList = async (kword, progressEmitter) => {
  const noCookieSearch = await getPlayerSettingKey('noCookieBiliSearch');
  let cookieSESSDATA = null;
  // this API needs a random buvid3 value, or a valid SESSDATA;
  // otherwise will return error 412. for users didnt login to bilibili,
  // setting a random buvid3 would enable this API. should i initialize it
  // in start up?
  if (noCookieSearch) {
    cookieSESSDATA = await chrome.cookies.get({ url: 'https://bilibili.com', name: 'SESSDATA' });
    await chrome.cookies.set({
      url: 'https:api.bilibili.com', domain: '.bilibili.com', name: 'SESSDATA', value: 'dummyval',
    });
  }
  let val = [];
  try {
    val = await fetchBiliPaginatedAPI(
      URL_BILI_SEARCH.replace('{keyword}', kword),
      (data) => { return Math.min(data.numResults, data.pagesize * 2); },
      (data) => { return data.pagesize; },
      (js) => { return js.data.result; },
      progressEmitter,
      [],
    );
  } catch (e) {
    console.error(e);
  } finally {
    if (noCookieSearch) {
      await chrome.cookies.set({
        url: 'https:api.bilibili.com', domain: '.bilibili.com', name: 'SESSDATA', value: cookieSESSDATA.value,
      });
    }
  }
  return val;
};

/**
 * Private Util to extract json, see https://github.com/SocialSisterYi/bilibili-API-collect
 * @param {Object} json
 * @param {string} field
 * @returns
 */
const extractResponseJson = (json, field) => {
  if (field === 'AudioUrl') {
    try {
      return json.data.dash.audio[0].baseUrl;
    } catch (e) {
      console.error(json);
      return '';
    }
  } else if (field === 'VideoUrl') {
    try {
      return json.data.dash.video[0].baseUrl;
    } catch (e) {
      console.error(json);
      return '';
    }
  } else if (field === 'CID') {
    return json.data[0].cid;
  } else if (field === 'AudioInfo') {
    return {};
  }
};

export const searchLyricOptions = async (searchKey, setOptions) => {
  logger.info('calling searchLyricOptions');
  if (searchKey === '') {
    setOptions([]);
    return;
  }
  const res = await fetch(URL_QQ_SEARCH.replace('{KeyWord}', searchKey));
  const json = await res.json();
  const data = json.data.song.itemlist;
  const slimData = data.map((s, v) => { return { key: s.mid, songMid: s.mid, label: `${v}. ${s.name} / ${s.singer}` }; });

  setOptions(slimData);
};

export const searchLyric = async (searchMID, setLyric) => {
  logger.info('calling searchLyric');
  const res = await fetch(URL_QQ_LYRIC.replace('{SongMid}', searchMID));
  const json = await res.json();
  if (!json.lyric) {
    setLyric('[00:00.000] 无法找到歌词,请手动搜索');
    return;
  }

  let finalLrc = json.lyric;

  // Merge trans Lyrics
  if (json.trans) { finalLrc = `${json.trans}\n${finalLrc}`; }

  // console.log(finalLrc)
  setLyric(finalLrc);
};
