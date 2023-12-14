/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import Youtube from 'youtube-stream-url';

import { regexFetchProps } from '@APM/utils/mediafetch/generic';
import { biliApiLimiter } from '@APM/utils/mediafetch/throttle';
import SongTS from '@objects/Song';
import { SOURCE } from '@enums/MediaFetch';

const CIDPREFIX = 'youtube-';

export const fetchYoutubeVideo = async (ytbid: string) => {
  if (!ytbid.includes('youtube.com')) {
    ytbid = `https://www.youtube.com/watch?v=${ytbid}`;
  }
  return Youtube.getInfo({ url: ytbid, throwOnError: true });
};

const resolveURL = async (song: NoxMedia.Song) => {
  const extractedVideoInfo = await fetchYoutubeVideo(song.bvid);
  let maxAudioQualityStream = { bitrate: 0, url: '' };
  console.log(extractedVideoInfo.formats);
  for (const videoStream of extractedVideoInfo.formats) {
    if (
      videoStream.loudnessDb &&
      videoStream.bitrate > maxAudioQualityStream.bitrate // &&
      // videoStream.mimeType.includes('mp4a')
    ) {
      maxAudioQualityStream = videoStream;
    }
  }
  console.log(maxAudioQualityStream);
  return maxAudioQualityStream;
};

const refreshSong = (song: NoxMedia.Song) => song;

const regexFetch = async ({ reExtracted }: regexFetchProps) => {
  const audioInfo = await fetchAudioInfo(reExtracted[1]!);
  return audioInfo || [];
};

const fetchAudioInfo = async (
  bvid: string,
  progressEmitter: () => void = () => undefined,
) =>
  await biliApiLimiter.schedule(() => {
    progressEmitter();
    return fetchAudioInfoRaw(bvid);
  });

const fetchAudioInfoRaw = async (sid: string) => {
  const ytdlInfo = await fetchYoutubeVideo(sid);
  const { videoDetails } = ytdlInfo;
  const validDurations = ytdlInfo.formats.filter(
    (format: any) => format.approxDurationMs,
  );
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
        ].url,
      lyric: '',
      page: 1,
      duration:
        validDurations.length > 0
          ? Math.floor(
              Number.parseInt(validDurations[0].approxDurationMs!) / 1000,
            )
          : 0,
      album: videoDetails.title,
      source: SOURCE.ytbvideo,
      metadataOnLoad: true,
    }),
  ];
};

export default {
  regexSearchMatch: /youtu(?:.*\/v\/|.*v=|\.be\/)([A-Za-z0-9_-]{11})/,
  resolveURL,
  regexFetch,
  regexResolveURLMatch: /^youtube-/,
  refreshSong,
  suggest: () => [],
};
