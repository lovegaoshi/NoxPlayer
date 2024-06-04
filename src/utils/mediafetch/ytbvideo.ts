// eslint-disable-next-line import/no-extraneous-dependencies, camelcase
import { biliApiLimiter } from '@APM/utils/mediafetch/throttle';
import {
  resolveURL,
  fetchAudioInfo as fetchAudioInfoMuse,
} from '@APM/utils/mediafetch/ytbvideo.muse';

const refreshSong = (song: NoxMedia.Song) => song;

const regexFetch = async ({
  reExtracted,
}: NoxNetwork.RegexFetchProps): Promise<NoxNetwork.NoxRegexFetch> => {
  const audioInfo = await fetchAudioInfo(reExtracted[1]!);
  return { songList: audioInfo || [] };
};

export const fetchAudioInfo = (
  bvid: string,
  progressEmitter: () => void = () => undefined,
) =>
  biliApiLimiter.schedule(() => {
    progressEmitter();
    return fetchAudioInfoMuse(bvid);
  });

export default {
  regexSearchMatch: /youtu(?:.*\/v\/|.*v=|\.be\/)([A-Za-z0-9_-]{11})/,
  resolveURL,
  regexFetch,
  regexResolveURLMatch: /^youtube-/,
  regexResolveURLMatch2: /^ytbvideo-/,
  refreshSong,
  suggest: () => [],
  export2URL: (song: NoxMedia.Song) =>
    `https://www.youtube.com/watch?v=${song.bvid}`,
};
