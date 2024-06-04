import SongTS from '@objects/Song';
import { Source } from '@enums/MediaFetch';
import { Innertube } from 'youtubei.js/web';

const ytClient = Innertube.create({
  fetch: async (input, init?: RequestInit) => {
    // Modify the request
    // and send it to the proxy

    // fetch the URL

    // @ts-expect-error
    return fetch(input, init);
  },
});

export const resolveURL = async (song: NoxMedia.Song) => {
  const yt = await ytClient;
  const extractedVideoInfo = await yt.getInfo(song.bvid);
  const maxAudioQualityStream = extractedVideoInfo.chooseFormat({
    quality: 'best',
    type: 'audio',
  });
  return {
    url: maxAudioQualityStream.decipher(yt.session.player),
    loudness: maxAudioQualityStream.loudness_db,
  };
};

export const fetchAudioInfo = async (sid: string) => {
  const yt = await ytClient;
  const videoInfo = (await yt.getBasicInfo(sid)).basic_info;
  return [
    SongTS({
      cid: `${Source.ytbvideo}-${sid}`,
      bvid: sid,
      name: videoInfo.title!,
      nameRaw: videoInfo.title!,
      singer: videoInfo.author!,
      singerId: videoInfo.channel_id!,
      cover: videoInfo.thumbnail
        ? videoInfo.thumbnail[videoInfo.thumbnail.length - 1]!.url
        : '',
      lyric: '',
      page: 1,
      duration: videoInfo.duration,
      album: videoInfo.title!,
      source: Source.ytbvideo,
      metadataOnLoad: true,
    }),
  ];
};
