declare namespace NoxMediaInfo {
  /**
   * this interface serves
   * http://api.bilibili.com/x/web-interface/view?bvid=BV1bv4y1p7K4
   */

  export interface VideoInfo {
    [key: string]: any;
  }

  export interface VideoInfoJsonData extends VideoInfo {
    bvid: string;
    aid: number;
    videos: number;
    tid: number;
    tname: string;
    pic: string;
    title: string;
    owner: {
      mid: number;
      name: string;
      face: string;
    };
    pages: Array<{
      cid: number;
      page: number;
      part: string;
      duration: number;
      [key: string]: any;
    }>;
    duration: number;
  }

  /**
   * this interface serves
   * https://www.bilibili.com/audio/music-service-c/web/song/info?sid=13598
   */
  export interface AudioInfoJsonData extends VideoInfo {
    title: string;
    id: number;
    duration: number;
    cover: string;
    bvid: string;
    aid: number;
    lyric: string;
    uname: string;
    author: string;
    uid: number;
  }
}
