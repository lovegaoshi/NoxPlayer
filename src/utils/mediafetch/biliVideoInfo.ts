import bfetch from '@utils/BiliFetch';
import { Source } from '@enums/MediaFetch';
import SongTS from '@objects/Song';
import { logger } from '../Logger';

const URL_VIDEO_INFO = 'https://api.bilibili.com/x/web-interface/view';

export const fetchAVIDRaw = async (aid: string): Promise<NoxMedia.Song[]> => {
  const api = `${URL_VIDEO_INFO}?aid=${aid}`;
  logger.info(`calling fetchAVID of ${aid} of ${api}`);
  try {
    const res = await bfetch(api);
    const json = await res.json();
    const { data } = json;
    return data.pages.map((page: any, index: number) => {
      const filename = data.pages.length === 1 ? data.title : page.part;
      return SongTS({
        cid: page.cid,
        bvid: data.bvid,
        name: filename,
        nameRaw: filename,
        singer: data.owner.name,
        singerId: data.owner.mid,
        cover: data.pic,
        lyric: '',
        page: index + 1,
        duration: page.duration,
        album: data.title,
        source: Source.bilivideo,
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(error.message);
    logger.warn(`Some issue happened when fetching ${aid}`);
    return [];
  }
};

export const fetchBVIDRaw = async (bvid: string): Promise<NoxMedia.Song[]> => {
  const api = `${URL_VIDEO_INFO}?bvid=${bvid}`;
  logger.info(`calling fetchBVID of ${bvid} of ${api}`);
  try {
    const res = await bfetch(api);
    const json = await res.json();
    const { data } = json;
    return data.pages.map((page: any, index: number) => {
      const filename = data.pages.length === 1 ? data.title : page.part;
      return SongTS({
        cid: page.cid,
        bvid,
        name: filename,
        nameRaw: filename,
        singer: data.owner.name,
        singerId: data.owner.mid,
        cover: data.pic,
        lyric: '',
        page: index + 1,
        duration: page.duration,
        album: data.title,
        source: Source.bilivideo,
      });
    });
  } catch (error: any) {
    logger.error(error.message);
    logger.warn(`Some issue happened when fetching ${bvid}`);
    return [];
  }
};

export const BVIDtoAID = async (bvid: string): Promise<string> => {
  const res = await bfetch(`${URL_VIDEO_INFO}?bvid=${bvid}`);
  const json = await res.json();
  return String(json.data.aid);
};
