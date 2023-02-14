import { reExtractSongName } from '../utils/re';

export default class Song {
    constructor({ cid, bvid, name, singer, cover, musicSrc, singerId, lyric, lyricOffset }) {
        this.id = cid
        this.bvid = bvid
        this.name = name
        this.singer = singer
        this.singerId = singerId
        this.cover = cover
        this.musicSrc = musicSrc
        this.lyric = lyric
        this.lyricOffset = lyricOffset
        this.parsedName = reExtractSongName(this.name, this.singerId)
        this.biliShazamedName = undefined
    }

    /**
     * get the name of this song.
     * this is a breaking change; need an update function.
     * @param {boolean} parsed a flag to return the parsed name if exist.
     * @returns name
     */
    getName (parsed = true) {
        if (this.biliShazamedName) return this.biliShazamedName
        if (parsed) {
            return this.parsedName? this.parsedName : this.name
        } else {
            return this.name
        }
    }
}