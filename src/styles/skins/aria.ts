import PomeloTheme from './pomelo';
import { fetchVideoPlayUrlPromise } from '../../utils/Data';
import skinTemplate, { randomChoice } from './template';

const gifs = [
  'https://i0.hdslb.com/bfs/garb/6e41af761ef1ba1857a8c2bb94b0fdbbbcde4eb0.png',
  'https://i0.hdslb.com/bfs/garb/b7fc30e923e5a72a3e03ad46a1ac85a319311450.png',
  'https://i0.hdslb.com/bfs/garb/57478d5cad09ec8247e71597808bb56453a6c4a1.png',
  'https://i0.hdslb.com/bfs/garb/e6fb6cc70f3047a533449f73197a87a3d0b57d14.png',
  'https://i0.hdslb.com/bfs/garb/b23bba715e6935746920297dd1b0f605a2494581.png',
  'https://i0.hdslb.com/bfs/garb/4b188f791af0f41714a227143beb3345da1ec293.png',
  'https://i0.hdslb.com/bfs/garb/11c578357aa2d88e1d5b1c3f1e448105844136e2.png',
  'https://i0.hdslb.com/bfs/garb/8a5cd26e14f43fd7a0e931b05a3f315acb67449f.png',
  'https://i0.hdslb.com/bfs/garb/c0b2e817293f245c295eb3b2ad0f7c1923b30b09.png',
  'https://i0.hdslb.com/bfs/garb/f7da96d99905441e6dfb66976999c89ea0a2cce1.png',
  'https://i0.hdslb.com/bfs/garb/25a6555e97f9f17aa839c06cd1b0bcb144f06fcc.png',
  'https://i0.hdslb.com/bfs/garb/4b574836d38f2fe62e88f8540a889e3a113637d7.png',
  'https://i0.hdslb.com/bfs/garb/1fcb014801ee66ba35966fff19d018b17d52bbbf.png',
  'https://i0.hdslb.com/bfs/garb/09ee26ea332faed2c5643743a7239c6833cb9e69.png',
  'https://i0.hdslb.com/bfs/garb/97cb6eccaf7dc5d3e1c10724d47394be0d34384a.png',
  'https://i0.hdslb.com/bfs/garb/7d18f53f480702c960ff65126e3a37d918fe14dd.png',
  'https://i0.hdslb.com/bfs/garb/7fc12f2f8009e07ab94ead4adb9482787f1c29b9.png',
  'https://i0.hdslb.com/bfs/garb/1c00ffe909e7324eb31c4925221cf90a7fa35cdd.png',
  'https://i0.hdslb.com/bfs/garb/22d1dfcea94c544a12f624aa5a9715c927a60516.png',
  'https://i0.hdslb.com/bfs/garb/5e4463c9fee7f78a8fcc0c5725c0353f1ff1d60f.png',
  'https://i0.hdslb.com/bfs/new_dyn/b89a12f0fe3dfe431332d83cc26e6209527836.png',
  'https://i0.hdslb.com/bfs/new_dyn/3934abd85fd904c58a20f5e9e37873e8389308.gif',
  'https://i0.hdslb.com/bfs/new_dyn/42d391120ff6f84b43f7c5c2cb43c7ab10850238.jpg',
  'https://i0.hdslb.com/bfs/new_dyn/a81baa9a225b8cb2b4bfbcfc47ae911c10850238.jpg',
  'https://i0.hdslb.com/bfs/new_dyn/20597fb26855d4f2f29076bfe99821aa19193176.png',
];
const dump = [
  'http://i0.hdslb.com/bfs/live/7764acb857ae97ce072f21985655dbb8509abdaa.png',
  'http://i0.hdslb.com/bfs/live/83d63e6850ca2a6af4d1dfaaed4ede8671682b59.png',
  'http://i0.hdslb.com/bfs/live/00708792d33fff11b08cb528ee741e44636d6d96.png',
  'http://i0.hdslb.com/bfs/live/392d50c857c3884a5cd0e9be21059eac5666914d.png',
  'http://i0.hdslb.com/bfs/live/d8e581fc7eaea6517b6e17da99f57f29c58832dc.png',
  'http://i0.hdslb.com/bfs/live/03aee301820f614bf990c43cd715b0dc2c8361eb.png',
  'http://i0.hdslb.com/bfs/live/b1a165c60ca7ddacf976d1df91778406173b12fc.png',
  'http://i0.hdslb.com/bfs/live/b4ac142ca7e74cf253171b9cce30a7a6f46bb38b.png',
  'http://i0.hdslb.com/bfs/live/a153df702a20a2d9fe46c856442a4fbf12e44a85.png',
  'http://i0.hdslb.com/bfs/live/1b7096c2e33787b15b0022ab444473e7b20258c0.png',
];

export default skinTemplate({
  playerBanner: PomeloTheme.playerBanner,
  playerBannerMobile: PomeloTheme.playerBannerMobile,
  // playerBackground: async () => new Promise<string>((resolve) => { resolve('https://cdn.donmai.us/original/f5/cd/__watson_amelia_bubba_and_smol_ame_hololive_and_1_more_drawn_by_ro_g_oowack__f5cd65a11ff91b10f52aba05f46aa5e0.jpg'); }),
  playerBackground: async () => await fetchVideoPlayUrlPromise('BV1VM411q7j6', undefined, 'VideoUrl'),
  playerBackgroundVideo: true,
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: '电鱼播放器',
  desktopTheme: 'light',
  colorTheme: PomeloTheme.colorTheme,
  reactJKPlayerTheme: PomeloTheme.reactJKPlayerTheme,
  maintainer: '铵溶液制造工厂@bilibili',
  maintainerTooltip: '塞克西开~人人爱~',
});
