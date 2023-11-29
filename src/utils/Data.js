import Bottleneck from 'bottleneck';

import Logger from './Logger';
import VideoInfo from '../objects/VideoInfo';

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
 *
 * @param {string} bvid
 * @returns
 */
export const fetchVideoInfoRaw = async ({ bvid }) => {
  Logger.info('calling fetchVideoInfo');
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
