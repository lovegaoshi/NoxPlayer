import useLyric from '@APM/hooks/useLyric';
import { LrcSource } from '@APM/enums/LyricFetch';

// HACK: instead of a local lrc cache, just use a simple global var cache...?
// TODO: make a proper cache
let cachedLrc = ['', ''];

export default (currSong: NoxMedia.Song) => {
  const usedLyric = useLyric(currSong);
  const fetchAndSetLyricOptions = (adhocTitle = currSong.name) =>
    usedLyric.fetchAndSetLyricOptions(adhocTitle, [
      LrcSource.QQ,
      LrcSource.BiliBili,
    ]);

  const getLrcFromLocal = async (song?: NoxMedia.Song) => {
    const lrcDetail = usedLyric.getLrcFromLocal(song);
    if (lrcDetail === undefined) return;
    const localLrc =
      cachedLrc[0] === lrcDetail.lyricKey ? cachedLrc[1]! : lrcDetail.lyric;
    return {
      lrcDetail,
      localLrc,
    };
  };

  const loadLocalLrc = async (
    lyricPromise: Promise<NoxLyric.NoxFetchedLyric[]>,
  ) => {
    const localLrcColle = getLrcFromLocal(currSong);
    return usedLyric.loadLocalLrc(getLrcFromLocal(currSong), async () =>
      searchAndSetCurrentLyric({
        resolvedLrcOptions: await lyricPromise,
        resolvedLyric: (await localLrcColle)?.lrcDetail,
      }),
    );
  };

  const updateLyricMapping = ({
    resolvedLrc,
    newLrcDetail = {},
    song,
    lrc,
    currentTimeOffset,
  }: NoxLyric.UpdateLyricMapping) => {
    if (resolvedLrc) {
      const lyricDeatail: NoxMedia.LyricDetail = {
        songId: song.id,
        lyricKey: resolvedLrc.key,
        lyricOffset: currentTimeOffset,
        ...newLrcDetail,
        // TODO: do not store this in ChromeStorage that can be synced
        lyric: '',
        source: resolvedLrc.source,
      };
      cachedLrc = [lyricDeatail.lyricKey, lrc];
      usedLyric.setLyricMapping(lyricDeatail);
    }
  };

  const searchAndSetCurrentLyric = ({
    index = 0,
    resolvedLrcOptions = usedLyric.lrcOptions,
    resolvedLyric,
    song = currSong,
  }: NoxLyric.SearchLyricL) =>
    usedLyric.searchAndSetCurrentLyric({
      updateLyricMapping,
      index,
      resolvedLrcOptions,
      resolvedLyric,
      song,
    });

  const initTrackLrcLoad = () =>
    usedLyric.initTrackLrcLoad(
      fetchAndSetLyricOptions,
      loadLocalLrc,
      searchAndSetCurrentLyric,
    );

  return {
    ...usedLyric,
    fetchAndSetLyricOptions,
    initTrackLrcLoad,
    searchAndSetCurrentLyric,
  };
};
