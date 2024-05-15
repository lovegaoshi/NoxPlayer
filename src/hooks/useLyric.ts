import useLyric from '@APM/hooks/useLyric';
import { LrcSource } from '@enums/LyricFetch';

export default (song: NoxMedia.Song) => {
  const usedLyric = useLyric(song);
  const fetchAndSetLyricOptions = (adhocTitle = song.name) =>
    usedLyric.fetchAndSetLyricOptions(adhocTitle, [
      LrcSource.QQ,
      LrcSource.BiliBili,
    ]);
  return { ...usedLyric, fetchAndSetLyricOptions };
};
