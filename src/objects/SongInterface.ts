export default interface Song {
  id: string | number;
  bvid: string;
  name: string;
  nameRaw: string;
  singer: string;
  singerId: string | number;
  cover: string;
  musicSrc: string;
  lyric: string;
  lyricOffset: number;
  parsedName: string;
  biliShazamedName: string;
  page: number | undefined;
  // eslint-disable-next-line semi
}
