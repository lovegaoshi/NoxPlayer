import { bvidToAid } from '@APM/utils/bvid';

const BILI_LIKE_API = 'https://api.bilibili.com/x/web-interface/archive/like';
const BILI_TRIP_API =
  'https://api.bilibili.com/x/web-interface/archive/like/triple';
const BILI_FAV_API = 'https://api.bilibili.com/x/v3/fav/resource/deal';
const BILI_VIDEOPLAY_API =
  'https://api.bilibili.com/x/click-interface/click/web/h5';
const BILI_HEARTBEAT_API =
  'https://api.bilibili.com/x/click-interface/web/heartbeat';
const BILI_VIDEOINFO_API =
  'https://api.bilibili.com/x/web-interface/view?bvid=';

/**
 * get a cookie using chrome.cookies.get.
 * @param {string} domain url of the cookie, eg bilibili.com
 * @param {string} name name of the cookie, eg SESSIONDATA
 * @returns
 */
export const getCookie = async (domain: string, name: string) => {
  return chrome.cookies.get({ url: domain, name });
};

/**
 * use api.bilibili.com/x/web-interface/archive/has/like?bvid=
 * to check if a bvid is liked by the current logged in bilibili user.
 * @param {string} bvid bvid of the bilibili video.
 * @param {function} onChecked callback  function with the input parameter of the
 * looked up json API return.
 */
export const checkBVLiked = (bvid: string, onChecked: Function = () => {}) => {
  fetch(
    `https://api.bilibili.com/x/web-interface/archive/has/like?bvid=${bvid}`,
    {
      credentials: 'include',
      referrer: `https://www.bilibili.com/video/${bvid}/`,
    },
  )
    .then((res) => res.json())
    .then((json) => onChecked(json.data))
    .catch(() => onChecked(undefined));
};

/**
 * use https://api.bilibili.com/x/web-interface/archive/like to like a video.
 * @param {string} bvid bvid of the bilibili video.
 * @param {function} onLiked callback function with the input parameter of the
 * looked up json API return.
 */
export const sendBVLike = (bvid: string, onLiked = (_json: object) => {}) => {
  getCookie('https://www.bilibili.com', 'bili_jct').then((promised) => {
    fetch(BILI_LIKE_API, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // i dont think this is necessary anymore?
      referrerPolicy: 'unsafe-url',
      referrer: `https://www.bilibili.com/video/${bvid}/`,
      body: new URLSearchParams({
        bvid,
        like: '1',
        csrf: promised ? promised.value : '',
      }),
    })
      .then((res) => res.json())
      .then((json) => onLiked(json))
      .catch((error) => console.error('BVID like POST failed;', error));
  });
};

export const sendBVTriple = (bvid: string, onLiked = (_json: object) => {}) => {
  getCookie('https://www.bilibili.com', 'bili_jct').then((promised) => {
    fetch(BILI_TRIP_API, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // i dont think this is necessary anymore?
      referrerPolicy: 'unsafe-url',
      referrer: `https://www.bilibili.com/video/${bvid}/`,
      body: new URLSearchParams({
        bvid,
        csrf: promised ? promised.value : '',
      }),
    })
      .then((res) => res.json())
      .then((json) => onLiked(json))
      .catch((error) => console.error('BVID triple POST failed;', error));
  });
};

export const sendBVFavorite = async (
  bvid: string,
  addfav: string[] = [],
  removefav: string[] = [],
) => {
  try {
    const biliject = await getCookie('https://www.bilibili.com', 'bili_jct');
    const res = await fetch(BILI_FAV_API, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrer: `https://www.bilibili.com/video/${bvid}/`,
      body: new URLSearchParams({
        rid: String(bvidToAid(bvid)),
        add_media_ids: addfav.join(','),
        del_media_ids: removefav.join(','),
        csrf: (biliject?.value as string) || '',
        type: '2',
      }),
    });
    return await res.json();
  } catch (e) {
    console.error('BVID favorite POST failed;', e);
  }
};

/**
 * checks a video played count, for debug use.
 * @param {string} bvid
 */
export const checkBiliVideoPlayed = (bvid: string) => {
  fetch(BILI_VIDEOINFO_API + bvid)
    .then((res) => res.json())
    .then((json) => console.debug(`${bvid} view count:${json.data.stat.view}`))
    .catch(console.error);
};

/**
 * see this csdn post.
 * https://blog.csdn.net/zhaowz123456/article/details/125701001
 * @param {string} bvid
 * @param {number} cid
 */
export const initBiliHeartbeat = async ({
  bvid,
  cid,
}: {
  bvid: string;
  cid: string;
}) => {
  if (Number.isNaN(parseInt(cid, 10))) return;
  fetch(BILI_VIDEOPLAY_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    mode: 'no-cors',
    // this is necessary. otherwise bili will return -400 status code errors
    credentials: 'omit',
    body: new URLSearchParams({
      bvid,
      cid,
    }),
  });
};

/**
 * heartbeat api is totally not necessary to increase video viewed count. see above csdn post.
 * @param {string} bvid
 * @param {number} cid
 * @param {number} time
 */
export const sendBiliHeartbeat = async ({
  bvid,
  cid,
  time,
}: {
  bvid: string;
  cid: string;
  time: string;
}) => {
  fetch(BILI_HEARTBEAT_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      bvid,
      cid,
      realtime: time,
      played_time: time,
      real_played_time: time,
      dt: '2',
      play_type: '1',
    }),
  });
};
