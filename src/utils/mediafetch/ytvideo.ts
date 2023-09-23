/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import Youtube from 'youtube-stream-url';

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
      videoStream.bitrate > maxAudioQualityStream.bitrate
    ) {
      maxAudioQualityStream = videoStream;
    }
  }
  console.log(maxAudioQualityStream);
  return maxAudioQualityStream.url;
};

export default {
  regexResolveURLMatch: /^youtube/,
  resolveURL,
};
