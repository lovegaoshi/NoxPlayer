import bilivideoFetch from '@APM/utils/mediafetch/bilivideo';

import { readLocalStorage } from '../utils/ChromeStorage';

const DEFAULT_BVID = 'BV1g34y1r71w';
const LAST_PLAY_LIST = 'LastPlayList';

// Load last-playist from storage, else use DEFAULT_BVID as initial list.
export default async (setCurrentSongList) => {
  const result = await readLocalStorage(LAST_PLAY_LIST);
  if (result && result.length !== 0) {
    // console.log(result)
    const defaultSongList = result;
    setCurrentSongList(defaultSongList);
  } else {
    const defaultSongList = await bilivideoFetch.regexFetch({
      reExtracted: [null, DEFAULT_BVID],
    });
    setCurrentSongList(defaultSongList);
  }
};
