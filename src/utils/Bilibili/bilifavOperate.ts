import { humanishApiLimiter } from '@APM/utils/mediafetch/throttle';
import { getFavListBVID } from '@APM/utils/mediafetch/bilifavlist';
import getBiliUser from '@APM/utils/Bilibili/BiliUser';
import { getCookie, sendBVFavorite } from './BiliOperate';

const BILI_GETFAVLIST_API =
  'https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid={mid}';
const BILI_CREFAVLIST_API = 'https://api.bilibili.com/x/v3/fav/folder/add';

// https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=3493085134719196
// not sure what fid means...
interface GETFAVLIST_RES {
  id: number;
  title: string;
  [key: string]: any;
}

// if len === 0 then create!
export const getBiliFavlist = async (
  usermid: string,
  matchingTitle: string,
) => {
  const res = await fetch(BILI_GETFAVLIST_API.replace('{mid}', usermid));
  const json = await res.json();
  const favlists = json.data.list as GETFAVLIST_RES[];
  return favlists.filter((val) => val.title === matchingTitle);
};

export const createBiliFavlist = async (title: string) => {
  const csrfToken = await getCookie('https://www.bilibili.com', 'bili_jct');
  const res = await fetch(BILI_CREFAVLIST_API, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    referrer: `https://www.bilibili.com/`,
    body: new URLSearchParams({
      title,
      csrf: csrfToken?.value || '',
    }),
  });
  const json = await res.json();
  return json.data.id;
};

export const getOrInsertBiliFavlist = async (
  usermid: string,
  matchingTitle: string,
) => {
  const getResult = await getBiliFavlist(usermid, matchingTitle);
  if (getResult.length > 0) {
    return getResult[0]!.id;
  }
  return createBiliFavlist(matchingTitle);
};

export const addToBiliFavlist = async (
  favlistid: string,
  bvids: string[],
  progressEmitter: (val: number) => void = (val: number) => undefined,
) => {
  const sendBVLikeEmitter = async (
    bvid: string,
    like: string[],
    unlike: string[],
    progressEmitterFn: () => void,
  ) => {
    await sendBVFavorite(bvid, like, unlike);
    progressEmitterFn();
  };
  const favedbvids = await getFavListBVID(favlistid);
  // unlike with a throttler
  await Promise.all(
    favedbvids
      .filter((val) => !bvids.includes(val))
      .map((val, i, arr) =>
        humanishApiLimiter.schedule(() =>
          sendBVLikeEmitter(val, [], [favlistid], () =>
            progressEmitter((i * 100) / arr.length),
          ),
        ),
      ),
  );
  // like
  await Promise.all(
    bvids
      .filter((val) => !favedbvids.includes(val))
      .map((val, i, arr) =>
        humanishApiLimiter.schedule(() =>
          sendBVLikeEmitter(val, [favlistid], [], () =>
            progressEmitter((i * 100) / arr.length),
          ),
        ),
      ),
  );
};

export const syncFavlist = async (favlist: NoxMedia.Playlist) => {
  const user = await getBiliUser();
  if (!user.mid) return false;
  const favid = await getOrInsertBiliFavlist(
    user.mid,
    favlist.title.slice(0, 19),
  );
  const uniqBVIDs = Array.from(
    favlist.songList.reduce(
      (accumulator, currentValue) => accumulator.add(currentValue.bvid),
      new Set() as Set<string>,
    ),
  );
  await addToBiliFavlist(
    favid,
    uniqBVIDs.filter((val) => val.startsWith('BV')),
  );
  return true;
};
