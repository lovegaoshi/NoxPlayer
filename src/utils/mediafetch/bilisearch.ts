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
// eslint-disable-next-line import/no-extraneous-dependencies

import { getPlayerSettingKey } from '../ChromeStorage';
import logger from '../Logger';
import { songFetch } from './bilivideo';
import { fetchBiliPaginatedAPI } from './paginatedbili';
import VideoInfo from '../../objects/VideoInfo';

const URL_BILI_SEARCH =
  'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword={keyword}&page={pn}';

export const fetchBiliSearchList = async (
  kword: string,
  progressEmitter: (val: number) => void = () => undefined,
) => {
  const noCookieSearch = await getPlayerSettingKey('noCookieBiliSearch');
  let cookieSESSDATA = null;
  // this API needs a random buvid3 value, or a valid SESSDATA;
  // otherwise will return error 412. for users didnt login to bilibili,
  // setting a random buvid3 would enable this API. should i initialize it
  // in start up?
  if (noCookieSearch) {
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
    });
  } catch (e) {
    console.error(e);
  } finally {
    if (noCookieSearch) {
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
}

const regexFetch = async ({
  url,
  progressEmitter = () => undefined,
  useBiliTag,
}: regexFetchProps) => {
  return songFetch({
    videoinfos: await fetchBiliSearchList(url, progressEmitter),
    useBiliTag: useBiliTag || false,
  });
};

const resolveURL = () => undefined;

const refreshSong = (song: NoxMedia.Song) => song;

export default {
  regexSearchMatch: /space.bilibili\.com\/(\d+)\/video/,
  regexFetch,
  regexResolveURLMatch: /^null-/,
  resolveURL,
  refreshSong,
};
