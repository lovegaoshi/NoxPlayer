/* eslint-disable prefer-destructuring */
/**
 * refactor:
 * bilisearch workflow:
 * reExtractSearch matches regex patterns and use the corresponding fetch functions;
 * fetch function takes extracted and calls a dataProcess.js fetch function;
 * dataprocess fetch function fetches VIDEOINFO using data.js fetch function, then parses into SONGS
 * data.js fetch function fetches VIDEOINFO.
 * steps to refactor:
 * each site needs a fetch to parse regex extracted, a videoinfo fetcher and a song fetcher.
 */

import { fetchBiliPaginatedAPI } from '@APM/utils/mediafetch/paginatedbili';
import { songFetch } from '@APM/utils/mediafetch//bilivideo';
import { fastSearchResolveBVID } from '@APM/utils/mediafetch/bilisearch';
import VideoInfo from '@APM/objects/VideoInfo';

const URL_BILI_SEARCH =
  'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword={keyword}&page={pn}&tids=3';
// TODO: migrate to this wbi one
// 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2?search_type=video&keyword={keyword}&page={pn}&tids=3';

const fetchBiliSearchList = async (
  kword: string,
  progressEmitter: (val: number) => void = () => undefined,
  fastSearch = true,
  cookiedSearch = false,
) => {
  let cookieSESSDATA = null;
  // this API needs a random buvid3 value, or a valid SESSDATA;
  // otherwise will return error 412. for users didnt login to bilibili,
  // setting a random buvid3 would enable this API. should i initialize it
  // in start up?
  if (!cookiedSearch) {
    cookieSESSDATA = await chrome.cookies.get({
      url: 'https://bilibili.com',
      name: 'SESSDATA',
    });
    await chrome.cookies.set({
      url: 'https:api.bilibili.com',
      domain: '.bilibili.com',
      name: 'SESSDATA',
      value: 'dummyval',
    });
  }
  let val: VideoInfo[] = [];
  try {
    val = await fetchBiliPaginatedAPI({
      url: URL_BILI_SEARCH.replace('{keyword}', kword),
      getMediaCount: (data) => Math.min(data.numResults, data.pagesize * 2),
      getPageSize: (data) => data.pagesize,
      getItems: (js) => js.data.result,
      progressEmitter,
      resolveBiliBVID: fastSearch
        ? async (bvobjs) => await fastSearchResolveBVID(bvobjs)
        : undefined,
    });
  } catch (e) {
    console.error(e);
  } finally {
    if (!cookiedSearch) {
      await chrome.cookies.set({
        url: 'https:api.bilibili.com',
        domain: '.bilibili.com',
        name: 'SESSDATA',
        value: cookieSESSDATA?.value,
      });
    }
  }
  return val;
};

interface regexFetchProps {
  url: string;
  progressEmitter: () => void;
  useBiliTag: boolean;
  fastSearch?: boolean;
  cookiedSearch?: boolean;
}

const regexFetch = async ({
  url,
  progressEmitter = () => undefined,
  useBiliTag,
  fastSearch = true,
  cookiedSearch = false,
}: regexFetchProps): Promise<NoxNetwork.NoxRegexFetch> => ({
  songList: await songFetch({
    videoinfos: await fetchBiliSearchList(
      url,
      progressEmitter,
      fastSearch,
      cookiedSearch,
    ),
    useBiliTag: useBiliTag || false,
  }),
});

const resolveURL = () => undefined;

const refreshSong = (song: NoxMedia.Song) => song;

export default {
  regexSearchMatch: /space.bilibili\.com\/(\d+)\/video/,
  regexFetch,
  regexResolveURLMatch: /^null-/,
  resolveURL,
  refreshSong,
};
