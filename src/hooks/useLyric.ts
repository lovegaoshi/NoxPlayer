import useLyric from '@APM/hooks/useLyric';
import { LrcSource } from '@enums/LyricFetch';

// HACK: instead of a local lrc cache, just use a simple global var cache...?
// TODO: make a proper cache
let cachedLrc = ['', ''];

export default (song: NoxMedia.Song) => {
  const usedLyric = useLyric(song);
  const fetchAndSetLyricOptions = (adhocTitle = song.name) =>
    usedLyric.fetchAndSetLyricOptions(adhocTitle, [
      LrcSource.QQ,
      LrcSource.BiliBili,
    ]);

  const getLrcFromLocal = async (song?: NoxMedia.Song) => {
    const lrcDetail = usedLyric.getLrcFromLocal(song);
    if (lrcDetail === undefined) return;
    const localLrc =
      cachedLrc[0] === lrcDetail.lyricKey ? cachedLrc[1]! : lrcDetail.lyric;
    console.log(localLrc);
    return {
      lrcDetail,
      localLrc,
    };
  };

  const loadLocalLrc = async (
    lyricPromise: Promise<NoxNetwork.NoxFetchedLyric[]>,
  ) => {
    const localLrcColle = getLrcFromLocal(song);
    return usedLyric.loadLocalLrc(getLrcFromLocal(song), async () =>
      searchAndSetCurrentLyric(
        undefined,
        await lyricPromise,
        (await localLrcColle)?.lrcDetail,
      ),
    );
  };

  const updateLyricMapping = ({
    resolvedLrc,
    newLrcDetail = {},
    song,
    lrc,
    currentTimeOffset,
  }: {
    resolvedLrc?: NoxNetwork.NoxFetchedLyric;
    newLrcDetail?: Partial<NoxMedia.LyricDetail>;
    lrc: string;
    song: NoxMedia.Song;
    currentTimeOffset: number;
  }) => {
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

  const searchAndSetCurrentLyric = (
    index = 0,
    resolvedLrcOptions = usedLyric.lrcOptions,
    resolvedLyric?: NoxMedia.LyricDetail,
    mSong = song,
  ) =>
    usedLyric.searchAndSetCurrentLyric(
      updateLyricMapping,
      index,
      resolvedLrcOptions,
      resolvedLyric,
      mSong,
    );

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
