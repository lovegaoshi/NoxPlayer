import { DEFAULT_NULL_URL } from '@objects/Song';

export default {
  regexSearchMatch: /local:\/\/(.+)/,
  regexResolveURLMatch: /^local-/,
  regexFetch: async () => ({ songList: [] }),
  resolveURL: async () => DEFAULT_NULL_URL,
  refreshSong: () => undefined,
  resolveArtwork: async () => DEFAULT_NULL_URL,
  resolveURLPrefetch: async (song: NoxMedia.Song) => ({ url: song.bvid }),
};
