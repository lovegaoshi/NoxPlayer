import { getBiliJct } from './biliCookies';

interface BVVideoInfo {
  filename: string;
  title: string;
  desc: string;
  cid: number;
}

interface BVInfo {
  cover: string;
  title: string;
  copyright: number;
  source: string;
  tid: number;
  tag: number;
  desc_format_id: number;
  desc: string;
  recreate: number;
  dynamic: string;
  interactive: string;
  aid: number;
  new_web_edit: number;
  videos: BVVideoInfo[];
  act_reserve_create: number;
  handle_staff: boolean;
  topic_grey: number;
  mission_id: number;
  subtitle: { open: 0; lan: '' };
  is_360: number;
  web_os: number;
  csrf: string;
}

export const getBiliVideoInfo = async (bvid: string) => {
  const url = `https://member.bilibili.com/x/vupre/web/archive/view?topic_grey=1&bvid=${bvid}`;
  const r = await fetch(url, { credentials: 'include' });
  const rjson = (await r.json()).data;
  const result: BVInfo = {
    cover: rjson.archive.cover,
    title: rjson.archive.title,
    copyright: rjson.archive.copyright,
    source: rjson.archive.source,
    tid: rjson.archive.tid,
    tag: rjson.archive.tag,
    desc_format_id: rjson.archive.desc_format_id,
    desc: rjson.archive.desc,
    recreate: -1,
    dynamic: rjson.archive.dynamic,
    interactive: rjson.archive.interactive,
    aid: rjson.archive.aid,
    new_web_edit: 1,
    videos: rjson.videos.map((video: any) => ({
      filename: video.filename,
      title: video.title,
      desc: video.desc,
      cid: video.cid,
    })),
    act_reserve_create: 0,
    handle_staff: false,
    topic_grey: 1,
    mission_id: 0,
    subtitle: { open: 0, lan: '' },
    is_360: -1,
    web_os: 3,
    csrf: (await getBiliJct())!.value,
  };

  return result;
};

export const editBiliVideo = async (
  bvid: string,
  cid: number,
  newTitle: string,
) => {
  const bvinfo = await getBiliVideoInfo(bvid);
  if (bvinfo.videos[cid] === undefined) {
    return;
  }
  bvinfo.videos[cid]!.title = newTitle;
  return fetch(
    `https://member.bilibili.com/x/vu/web/edit?csrf=${bvinfo.csrf}`,
    {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      referrer: `https://www.bilibili.com/`,
      body: JSON.stringify(bvinfo),
    },
  );
};
