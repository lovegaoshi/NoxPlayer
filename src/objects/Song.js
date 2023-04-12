import { reExtractSongName, extractParenthesis } from '../utils/re';

export default class Song {
  constructor({
    cid, bvid, name, singer, cover, musicSrc, singerId, lyric, lyricOffset, page, biliShazamedName,
  }) {
    this.id = cid;
    this.bvid = bvid;
    this.name = name;
    this.nameRaw = name;
    this.singer = singer;
    this.singerId = singerId;
    this.cover = cover;
    this.musicSrc = musicSrc;
    this.lyric = lyric;
    this.lyricOffset = lyricOffset;
    this.parsedName = reExtractSongName(this.name, this.singerId);
    this.biliShazamedName = biliShazamedName;
    this.page = page;
    setSongBiliShazamed(this, this.biliShazamedName);
  }
}

export const setSongBiliShazamed = (song, val) => {
  song.biliShazamedName = val;
  if (!val) return;
  song.biliShazamedName = extractParenthesis(val);
  song.nameRaw = song.name;
  song.name = song.biliShazamedName;
  song.parsedName = song.biliShazamedName;
};

export const removeSongBiliShazamed = (song) => {
  song.biliShazamedName = undefined;
  song.name = song.nameRaw;
  song.parsedName = reExtractSongName(song.name, song.singerId);
};
