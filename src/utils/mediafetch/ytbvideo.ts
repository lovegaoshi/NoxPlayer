// eslint-disable-next-line import/no-extraneous-dependencies, camelcase
import { get_song } from 'libmuse';

import { biliApiLimiter } from '@APM/utils/mediafetch/throttle';
import SongTS from '@objects/Song';
import { Source } from '@enums/MediaFetch';

const CIDPREFIX = `${Source.ytbvideo}-`;

const resolveURL = async (song: NoxMedia.Song) => {
  const extractedVideoInfo = await get_song(song.bvid);
  let maxAudioQualityStream = { bitrate: 0, url: '' };
  const formats =
    extractedVideoInfo.adaptive_formats ?? extractedVideoInfo.formats ?? [];
  for (const videoStream of formats) {
    if (
      videoStream.has_audio &&
      videoStream.bitrate > maxAudioQualityStream.bitrate &&
      videoStream.codecs.includes('mp4a')
    ) {
      maxAudioQualityStream = videoStream;
    }
  }
  return {
    ...maxAudioQualityStream,
    loudness: extractedVideoInfo.playerConfig.audioConfig.loudnessDb,
    perceivedLoudness:
      extractedVideoInfo.playerConfig.audioConfig.perceptualLoudnessDb,
  };
};

const refreshSong = (song: NoxMedia.Song) => song;

const regexFetch = async ({
  reExtracted,
}: NoxNetwork.RegexFetchProps): Promise<NoxNetwork.NoxRegexFetch> => {
  const audioInfo = await fetchAudioInfo(reExtracted[1]!);
  return { songList: audioInfo || [] };
};

const fetchAudioInfo = (
  bvid: string,
  progressEmitter: () => void = () => undefined,
) =>
  biliApiLimiter.schedule(() => {
    progressEmitter();
    return fetchAudioInfoRaw(bvid);
  });

const fetchAudioInfoRaw = async (sid: string) => {
  const ytdlInfo = await get_song(sid);
  console.debug(ytdlInfo);
  const { videoDetails } = ytdlInfo;
  const formats = ytdlInfo.adaptive_formats ?? ytdlInfo.formats ?? [];
  const validDurations = formats.filter((format) => format.duration_ms);
  return [
    SongTS({
      cid: `${CIDPREFIX}-${sid}`,
      bvid: sid,
      name: videoDetails.title,
      nameRaw: videoDetails.title,
      singer: videoDetails.author,
      singerId: videoDetails.channelId,
      cover:
        videoDetails.thumbnail.thumbnails[
          videoDetails.thumbnail.thumbnails.length - 1
        ]!.url,
      lyric: '',
      page: 1,
      duration:
        validDurations.length > 0
          ? Math.floor(validDurations[0]!.duration_ms / 1000)
          : 0,
      album: videoDetails.title,
      source: Source.ytbvideo,
      metadataOnLoad: true,
    }),
  ];
};

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
