import Bottleneck from 'bottleneck';

import { extractSongName } from '@APM/utils/re';
import steriatkFetch from '@APM/utils/mediafetch/steriatk';
import biliaudioFetch from '@APM/utils/mediafetch/biliaudio';
import ytvideoFetch from './mediafetch/ytvideo';

import logger from './Logger';
import VideoInfo from '../objects/VideoInfo';
import { getPlayerSettingKey, readLocalStorages } from './ChromeStorage';

/**
 * limits to bilibili API call to 200ms/call using bottleneck.
 * 100ms/call seems to brick IP after ~ 400 requests.
 */
const biliApiLimiter = new Bottleneck({
  minTime: 200,
  maxConcurrent: 5,
});

const awaitLimiter = new Bottleneck({
  minTime: 4000,
  maxConcurrent: 1,
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
const URL_PLAY_URL =
  'https://api.bilibili.com/x/player/playurl?cid={cid}&bvid={bvid}&qn=64&fnval=16';

/**
 *  bilibili API to get an audio's stream src url.
 * https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/audio/musicstream_url.md
 * https://api.bilibili.com/audio/music-service-c/url doesnt work.
 * au must be removed, eg. https://www.bilibili.com/audio/music-service-c/web/url?sid=745350
 */
const URL_AUDIO_PLAY_URL =
  'https://www.bilibili.com/audio/music-service-c/web/url?sid={sid}';
/**
 *  BVID -> CID
 */
const URL_BVID_TO_CID =
  'https://api.bilibili.com/x/player/pagelist?bvid={bvid}&jsonp=jsonp';
/**
 *  Audio Basic Info
 * https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/audio/info.md
 */
const URL_AUDIO_INFO =
  'https://www.bilibili.com/audio/music-service-c/web/song/info?sid={sid}';
/**
 *  Video Basic Info
 */
const URL_VIDEO_INFO =
  'https://api.bilibili.com/x/web-interface/view?bvid={bvid}';

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
export const fetchPlayUrlPromise = async (v) => {
  const cid = v.id;
  const regexResolveURLs = [
    [steriatkFetch.regexResolveURLMatch, steriatkFetch.resolveURL],
    [biliaudioFetch.regexResolveURLMatch, biliaudioFetch.resolveURL],
    [ytvideoFetch.regexResolveURLMatch, ytvideoFetch.resolveURL],
  ];
  for (const reExtraction of regexResolveURLs) {
    const reExtracted = reExtraction[0].exec(cid);
    if (reExtracted !== null) {
      return reExtraction[1](v);
    }
  }
  const { bvid } = v;
  const cidStr = cid.toString();
  if (cidStr.startsWith(ENUMS.audioType)) {
    return fetchAudioPlayUrlPromise(bvid);
  }
  return fetchVideoPlayUrlPromise(bvid, cid);
};

/**
 * returns the bilibili video stream url given a bvid and cid.
 * @param {string} bvid video's bvid. starts with BV.
 * @param {string | undefined} cid optional; if not provided, bvid is used to fetch cid. note
 * some videos have episodes that this may not be accurate.
 * @returns
 */
export const fetchVideoPlayUrlPromise = async (
  bvid,
  cid,
  extractType = 'AudioUrl',
) => {
  if (!cid || String(cid).startsWith('null-')) {
    cid = await fetchCID(bvid).catch((err) => console.error(err));
  }

  // Returns a promise that resolves into the audio stream url
  return new Promise((resolve, reject) => {
    // console.log('Data.js Calling fetchPlayUrl:' + URL_PLAY_URL.replace("{bvid}", bvid).replace("{cid}", cid))
    readLocalStorages(['CurrentPlaying', 'PlayerSetting']).then((result) => {
      // To prohibit current playing audio from fetching a new audio stream
      // If single loop, retreive the promise again.
      if (
        result.CurrentPlaying?.cid === cid &&
        result.PlayerSetting?.playMode === 'singleLoop'
      ) {
        // fixed return point; but why when repeat is single loop, a new promise is retrieved?
        resolve(result.CurrentPlaying.playUrl);
      } else {
        fetch(URL_PLAY_URL.replace('{bvid}', bvid).replace('{cid}', cid))
          .then((res) => res.json())
          .then((json) => resolve(extractResponseJson(json, extractType)))
          .catch((err) => reject(console.error(err)));
      }
    });
  });
};

const biliAPILimiterWrapper = async (
  params,
  func = () => {},
  progressEmit = () => {},
) => {
  return biliApiLimiter.schedule(() => {
    progressEmit();
    return func(params);
  });
};

/**
 * returns the bilibili audio stream url given a auid/sid.
 * @param {string} bvid audio's auid. starts with AU. eg.
 * https://www.bilibili.com/audio/au745350
 * @returns
 */
export const fetchAudioPlayUrlPromise = async (sid) => {
  // Returns a promise that resolves into the audio stream url
  return new Promise((resolve, reject) => {
    // console.log('Data.js Calling fetchPlayUrl:' + URL_PLAY_URL.replace("{bvid}", bvid).replace("{cid}", cid))
    readLocalStorages(['CurrentPlaying', 'PlayerSetting']).then((result) => {
      // To prohibit current playing audio from fetching a new audio stream
      // If single loop, retreive the promise again.
      if (
        result.CurrentPlaying?.bvid === sid &&
        result.PlayerSetting?.playMode === 'singleLoop'
      ) {
        // fixed return point; but why when repeat is single loop, a new promise is retrieved?
        resolve(result.CurrentPlaying.playUrl);
      } else {
        fetch(URL_AUDIO_PLAY_URL.replace('{sid}', sid))
          .then((res) => res.json())
          .then((json) => resolve(json.data.cdns[0]))
          .catch((err) => reject(console.error(err)));
      }
    });
  });
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
      data.pages.map((s) => {
        return { bvid, part: s.part, cid: s.cid };
      }),
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
