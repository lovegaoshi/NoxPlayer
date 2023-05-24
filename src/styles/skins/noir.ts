import skinTemplate, { randomChoice } from './template';
import clesss from './clesss';

const gifs = [
  'https://i0.hdslb.com/bfs/garb/item/f26e50aa169a95c08caf0550d637045247911719.png',
  'https://i0.hdslb.com/bfs/garb/item/2cd93e68680a661740158bf926aaf05bb43ca131.png',
  'https://i0.hdslb.com/bfs/garb/item/6dda219acdb584b0791200c30a651f60b1d29fc7.png',
  'https://i0.hdslb.com/bfs/garb/item/59085d848cb90b5721a1497e771018a247dd341f.png',
  'https://i0.hdslb.com/bfs/garb/item/e6b00bc4441a49aae505f2d4dc21e36ca7af4739.png',
  'https://i0.hdslb.com/bfs/garb/item/f2e2973c16ddc636f11484b782903d27f4ef25f0.png',
  'https://i0.hdslb.com/bfs/garb/item/6a8bfae4e329ac376f4feb42f23dfb8dcbc276ab.png',
  'https://i0.hdslb.com/bfs/garb/item/1cb97ad31ea40cccd1b9f099a9465f296fc8766a.png',
  'https://i0.hdslb.com/bfs/garb/item/4628753090b253a2be0728130c8175d4d3794973.png',
  'https://i0.hdslb.com/bfs/garb/item/9d4d6c15132a59fac5ccb59deb6673dc89eb3ee4.png',
  'https://i0.hdslb.com/bfs/garb/item/8075e991c4bf1b68507456a3ea5a0f4d4d5200f6.png',
  'https://i0.hdslb.com/bfs/garb/item/615031aa73c6f0ce14c8ea55ce42cd2f0c5241f9.png',
  'https://i0.hdslb.com/bfs/garb/item/d4463badd9c8f026d30dd0ade230ecb8aee9b1d0.png',
  'https://i0.hdslb.com/bfs/garb/item/82079096c2502f384c3462903906e209246d74d6.png',
  'https://i0.hdslb.com/bfs/garb/item/d165f1c604f67c83a146fa287fc4ac1014e672ba.png',
  'https://i0.hdslb.com/bfs/garb/item/bc4f650df001e5b87f7b0db22e940246d7731fe0.png',
  'https://i0.hdslb.com/bfs/garb/item/fd6ddb798a23c0c724eb238a711dbb0efccee793.png',
  'https://i0.hdslb.com/bfs/garb/item/ebacec7ad1669624bfae530c88fa20532fc9e783.png',
  'https://i0.hdslb.com/bfs/garb/item/67f2a3e7586dcb38067bbc484aede0588b5ec3cd.png',
  'https://i0.hdslb.com/bfs/garb/item/4b8bad8d75d5cc08e6103749d2d743a7d66028fa.png',
  'https://i0.hdslb.com/bfs/garb/item/9a19eeac81f77414e239c478aed35d4f28bf38f9.png',
  'https://i0.hdslb.com/bfs/garb/item/c6246d97941b1e9aa1818b0356a4a8b56c00d2b3.png',
  'https://i0.hdslb.com/bfs/garb/item/fea9a28709ff6c3b5d77a2a36850b67205e82851.png',
  'https://i0.hdslb.com/bfs/garb/item/1fbfa0a7ffb494fb10c3ded3e2a4a7dfe28153fd.png',
  'https://i0.hdslb.com/bfs/garb/item/42b5c3b8f41e804c3e045df69d9d0a4a8f2c399c.png',
];

const randomPortraitBackground = randomChoice([
  'https://i0.hdslb.com/bfs/garb/item/17f365d114f3a2749f3dde71b5f555fd4474ca9c.jpg',
  'https://i0.hdslb.com/bfs/garb/item/02257d22c49f8071394257131fdeae76e8b1dcf5.jpg',
  'https://i0.hdslb.com/bfs/garb/item/db50d5af88010eb3e7f68eb1b741544756d2395a.jpg',
  'https://i0.hdslb.com/bfs/garb/item/037772406cfc4c12fd6bb45d9ec64ff281b35ed1.mp4',
]) as string;

export default skinTemplate({
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
  colorTheme: clesss.colorTheme,
  reactJKPlayerTheme: clesss.reactJKPlayerTheme,
  maintainer: '黑泽诺亚的五元店@bilibili',
  maintainerTooltip: '',
  maintinerURL: 'https://live.bilibili.com/251015',
});
