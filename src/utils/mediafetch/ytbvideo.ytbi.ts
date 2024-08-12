import { ClientType, Innertube } from 'youtubei.js/web';

import SongTS from '@objects/Song';
import { Source } from '@APM/enums/MediaFetch';
import { logger } from '@utils/Logger';

const ytClient = Innertube.create({
  retrieve_player: true,
  enable_session_cache: false,
  generate_session_locally: false,
  client_type: ClientType.IOS,
  fetch: async (input, init?: RequestInit) => {
    // Modify the request
    // and send it to the proxy

    // fetch the URL

    // @ts-expect-error
    return fetch(input, init);
  },
});

export const resolveURL = async (song: NoxMedia.Song) => {
  logger.debug(`[ytbi.js] fetch YTB playURL promise:${song.bvid}`);
  const yt = await ytClient;
  const extractedVideoInfo = await yt.getBasicInfo(song.bvid, 'iOS');
  const maxAudioQualityStream = extractedVideoInfo.chooseFormat({
    quality: 'best',
    type: 'audio',
  });
  return {
    url: maxAudioQualityStream.decipher(yt.actions.session.player),
    loudness: maxAudioQualityStream.loudness_db,
  };
};

export const fetchAudioInfo = async (sid: string) => {
  const yt = await ytClient;
  const videoInfo = (await yt.getBasicInfo(sid, 'iOS')).basic_info;
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
