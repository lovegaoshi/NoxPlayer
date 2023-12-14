/* eslint-disable @typescript-eslint/ban-ts-comment */
import { regexFetchProps } from '@APM/utils/mediafetch/generic';
import { biliApiLimiter } from '@APM/utils/mediafetch/throttle';
import SongTS from '@objects/Song';
import { SOURCE } from '@enums/MediaFetch';

const CIDPREFIX = 'youtube-';

const fetchYoutubeVideo = async (id: string) => {
  // libmuse fetch is not intercepted; this is cped from mfsdk's ytb module.
  const data = {
    context: {
      client: {
        screenWidthPoints: 689,
        screenHeightPoints: 963,
        screenPixelDensity: 1,
        utcOffsetMinutes: 120,
        hl: 'en',
        gl: 'GB',
        remoteHost: '1.1.1.1',
        deviceMake: '',
        deviceModel: '',
        userAgent:
          'com.google.android.apps.youtube.music/6.14.50 (Linux; U; Android 13; GB) gzip',
        clientName: 'ANDROID_MUSIC',
        clientVersion: '6.14.50',
        osName: 'Android',
        osVersion: '13',
        originalUrl:
          'https://www.youtube.com/tv?is_account_switch=1&hrld=1&fltor=1',
        theme: 'CLASSIC',
        platform: 'MOBILE',
        clientFormFactor: 'UNKNOWN_FORM_FACTOR',
        webpSupport: false,
        timeZone: 'Europe/Amsterdam',
        acceptHeader:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
      user: { enableSafetyMode: false },
      request: {
        internalExperimentFlags: [],
        consistencyTokenJars: [],
      },
    },
    contentCheckOk: true,
    racyCheckOk: true,
    video_id: id,
  };

  const res = await fetch(
    'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );
  const json = await res.json();
  // const result = (await axios(config)).data;
  console.log(json);
  return json;
};

const resolveURL = async (song: NoxMedia.Song) => {
  const extractedVideoInfo = await fetchYoutubeVideo(song.bvid);
  let maxAudioQualityStream = { bitrate: 0, url: '' };
  const formats =
    extractedVideoInfo.streamingData.adaptiveFormats ??
    extractedVideoInfo.streamingData.formats ??
    [];
  for (const videoStream of formats) {
    if (
      videoStream.bitrate > maxAudioQualityStream.bitrate // &&
      // videoStream.mimeType.includes('mp4a')
    ) {
      maxAudioQualityStream = videoStream;
    }
  }
  console.log(maxAudioQualityStream);
  return {
    ...maxAudioQualityStream,
    loudness: extractedVideoInfo.playerConfig?.audioConfig?.loudnessDb,
    perceivedLoudness:
      extractedVideoInfo.playerConfig?.audioConfig?.perceptualLoudnessDb,
  };
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
  const formats =
    ytdlInfo.streamingData.adaptiveFormats ??
    ytdlInfo.streamingData.formats ??
    [];
  const validDurations = formats.filter(
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
