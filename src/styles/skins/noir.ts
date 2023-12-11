import skinTemplate, { randomChoice } from './template';
import clesss from './clesss';
import APMSkins from './APMSkins';

const { gifs } = APMSkins['泽宝播放器']!;

const randomPortraitBackground = randomChoice([
  'https://i0.hdslb.com/bfs/garb/item/17f365d114f3a2749f3dde71b5f555fd4474ca9c.jpg',
  'https://i0.hdslb.com/bfs/garb/item/02257d22c49f8071394257131fdeae76e8b1dcf5.jpg',
  'https://i0.hdslb.com/bfs/garb/item/db50d5af88010eb3e7f68eb1b741544756d2395a.jpg',
  'https://i0.hdslb.com/bfs/garb/item/037772406cfc4c12fd6bb45d9ec64ff281b35ed1.mp4',
]) as string;

export default () =>
  skinTemplate({
    playerBanner:
      'https://i0.hdslb.com/bfs/garb/item/4d1c96b086ff60d13e3a12d4e514baa028dbec1d.jpg',
    playerBannerMobile: async () =>
      new Promise<string>((resolve) => {
        resolve(randomPortraitBackground);
      }),
    playerBackgroundMobileVideo: randomPortraitBackground.includes('.mp4'),
    playerBackground: async () =>
      new Promise<string>((resolve) => {
        resolve(
          'https://i2.hdslb.com/bfs/archive/ec91f760738bd0a7af955b4f2797d70f0fcab40a.jpg',
        );
      }),
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
