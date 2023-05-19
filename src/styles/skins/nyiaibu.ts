import skinTemplate, { randomChoice } from './template';
import clesss from './clesss';
import { fetchVideoPlayUrlPromise } from '../../utils/Data';

const gifs = [
  'http://i0.hdslb.com/bfs/live/66ec3ed6855202f34996ae18c3a91a844addfd1a.png',
  'http://i0.hdslb.com/bfs/live/c296d6bab5113aa21ab9b0ecb16a37db02f14eff.png',
  'http://i0.hdslb.com/bfs/live/d86caeabb395d8cb457608bbbe68936031eee285.png',
  'http://i0.hdslb.com/bfs/live/224d84da054752bc96d0f84d98d1fdb609d90f54.png',
  'http://i0.hdslb.com/bfs/live/1e70f8b1658f1b028ef056503b9855e93dfc7e4d.png',
  'http://i0.hdslb.com/bfs/live/4aa07b90860096de4047733fb8c9522467021931.png',
  'http://i0.hdslb.com/bfs/live/d8804be4b7c27105ff5dd1af93d840fca30bd3e6.png',
  'http://i0.hdslb.com/bfs/live/35db7dc821109465b1a0882c5e9967f0af88199c.png',
  'http://i0.hdslb.com/bfs/live/7296da1a361114792a1ea435b9ed958393866a58.png',
  'http://i0.hdslb.com/bfs/live/ed07c7fb8b6d8cf800c47449dd453d7041aa2f0c.png',
];

const randomPortraitBackground = randomChoice([
  'https://i0.hdslb.com/bfs/garb/item/17f365d114f3a2749f3dde71b5f555fd4474ca9c.jpg',
  'https://i0.hdslb.com/bfs/garb/item/02257d22c49f8071394257131fdeae76e8b1dcf5.jpg',
  'https://i0.hdslb.com/bfs/garb/item/db50d5af88010eb3e7f68eb1b741544756d2395a.jpg',
  'https://i0.hdslb.com/bfs/garb/item/037772406cfc4c12fd6bb45d9ec64ff281b35ed1.mp4',
]) as string;

export default skinTemplate({
  playerBanner:
    'http://192.168.50.1:19527/getimg?imgserve=itsuki&file=niyabu.jpg',
  playerBannerMobile: async () =>
    new Promise<string>((resolve) => {
      resolve(randomPortraitBackground);
    }),
  playerBackgroundMobileVideo: randomPortraitBackground.includes('.mp4'),
  playerBackground: async () =>
    await fetchVideoPlayUrlPromise('BV1rh4y1b7wU', undefined, 'VideoUrl'), // BV1Sb4y1i79D
  playerBackgroundVideo: true,
  // playerBackground: async () => new Promise<string>((resolve) => { resolve('https://i0.hdslb.com/bfs/new_dyn/aae8c009d55b9db3472c1059b32cf16c1817527011.jpg'); }),
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: '泽宝播放器',
  colorTheme: clesss.colorTheme,
  reactJKPlayerTheme: clesss.reactJKPlayerTheme,
  maintainer: '黑泽诺亚的五元店@bilibili',
  maintainerTooltip: '',
  maintinerURL: 'https://live.bilibili.com/251015',
});
