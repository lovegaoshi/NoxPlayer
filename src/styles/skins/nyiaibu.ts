import { fetchVideoPlayUrl } from '@APM/utils/mediafetch/bilivideo';
import skinTemplate, { randomChoice } from './template';
import clesss from './clesss';
import APMSkins from './APMSkins';

const { gifs } = APMSkins['阿布播放器']!;

const randomPortraitBackground = randomChoice([
  'https://i0.hdslb.com/bfs/garb/item/17f365d114f3a2749f3dde71b5f555fd4474ca9c.jpg',
  'https://i0.hdslb.com/bfs/garb/item/02257d22c49f8071394257131fdeae76e8b1dcf5.jpg',
  'https://i0.hdslb.com/bfs/garb/item/db50d5af88010eb3e7f68eb1b741544756d2395a.jpg',
  'https://i0.hdslb.com/bfs/garb/item/037772406cfc4c12fd6bb45d9ec64ff281b35ed1.mp4',
]) as string;

export default () =>
  skinTemplate({
    playerBanner:
      'http://192.168.50.1:19527/getimg?imgserve=itsuki&file=niyabu.jpg',
    playerBannerMobile: async () =>
      new Promise<string>((resolve) => {
        resolve(randomPortraitBackground);
      }),
    playerBackgroundMobileVideo: randomPortraitBackground.includes('.mp4'),
    playerBackground: () =>
      fetchVideoPlayUrl(randomChoice(['BV1rh4y1b7wU', 'BV1SH4y1o7rk'])), // BV1Sb4y1i79D
    playerBackgroundVideo: true,
    // playerBackground: async () => new Promise<string>((resolve) => { resolve('https://i0.hdslb.com/bfs/new_dyn/aae8c009d55b9db3472c1059b32cf16c1817527011.jpg'); }),
    gifs,
    gifIcon: () => randomChoice(gifs) as string,
    appTitle: '泽宝播放器',
    colorTheme: clesss().colorTheme,
    reactJKPlayerTheme: clesss().reactJKPlayerTheme,
    maintainer: '黑泽诺亚的五元店@bilibili',
    maintainerTooltip: '',
    maintinerURL: 'https://live.bilibili.com/251015',
  });
