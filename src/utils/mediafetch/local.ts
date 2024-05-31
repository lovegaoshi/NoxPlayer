export default {
  regexSearchMatch: /NOT_IMPLEMETED_ERROR/,
  regexFetch: async () => ({ songList: [] }),
  regexResolveURLMatch: /NOT_IMPLEMENTED_ERROR/,
  resolveURL: async () => 'NOT_IMPLEMENTED_ERROR',
  refreshSong: () => undefined,
  resolveArtwork: async () => 'NOT_IMPLEMENTED_ERROR',
  resolveURLPrefetch: async (song: NoxMedia.Song) => ({ url: song.bvid }),
};
