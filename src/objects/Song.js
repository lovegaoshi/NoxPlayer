import { reExtractSongName, extractParenthesis } from '../utils/re';

export default class Song {
    constructor({ cid, bvid, name, singer, cover, musicSrc, singerId, lyric, lyricOffset, page }) {
        this.id = cid
        this.bvid = bvid
        this.name = this.nameRaw = name
        this.singer = singer
        this.singerId = singerId
        this.cover = cover
        this.musicSrc = musicSrc
        this.lyric = lyric
        this.lyricOffset = lyricOffset
        this.parsedName = reExtractSongName(this.name, this.singerId)
        this.biliShazamedName = undefined
        this.page = page
    }
}

export const setSongBiliShazamed = (song, val) => {
    song.biliShazamedName = extractParenthesis(val);
    if (!val) return;
    song.nameRaw = song.name;
    song.name = song.parsedName = song.biliShazamedName;
}

export const removeSongBiliShazamed = (song) => {
    song.biliShazamedName = undefined;
    song.name = song.nameRaw;
    song.parsedName = reExtractSongName(song.name, song.singerId);
}