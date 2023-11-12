declare namespace NoxMedia {
  export interface Song {
    id: string;
    bvid: string;
    name: string;
    nameRaw: string;
    singer: string;
    singerId: string | number;
    cover: string;
    lyric: string | undefined;
    lyricOffset: number | undefined;
    parsedName: string;
    biliShazamedName: string | undefined;
    page: number | undefined;
    duration: number;
    album?: string;
    addedDate?: number;
  }

  export interface Playlist {
    info: {
      title: string;
      id: string;
    };
    songList: Array<NoxMedia.Song>;
    settings: {
      autoRSSUpdate: boolean;
    };
    subscribeUrls: Array<string>;
    useBiliShazam: boolean;
    biliSync: boolean;
    bannedBVids: Array<string>;
    showFavoriteList: boolean;
  }

  export interface LyricDetail {
    songId: string;
    lyricKey: string;
    lyricOffset: number;
  }
}
