export default class VideoInfo {
  constructor(
    title,
    desc,
    videoCount,
    picSrc,
    uploader,
    pages,
    bvid,
    duration,
  ) {
    this.title = title;
    this.desc = desc;
    this.videoCount = videoCount;
    this.picSrc = picSrc;
    this.uploader = uploader;
    this.pages = pages;
    this.bvid = bvid;
    this.duration = duration;
  }

  isMutiPartVideo() {
    return this.videos > 1;
  }

  getMultiPartVideoList() {
    return this;
  }
}
