import AzusaTheme from './azusa';

const gifs = [
  'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=ItsukiRandomGIF/Itsuki0.gif',
  'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=ItsukiRandomGIF/Itsuki1.gif',
];
export default {
  playerBanner: 'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=itsukibg.jpg',
  playerBannerMobile: async () => new Promise((resolve) => { resolve('http://150.158.139.227:9527/getimg?imgserve=itsuki&file=Itsukibgm.png'); }),
  playerBackground: async () => new Promise((resolve) => { resolve('http://i0.hdslb.com/bfs/live/room_bg/1428a93e4a983a7a6e7ba3dc62b064e403fc8354.png@1920w_1080h.webp'); }),
  gifs,
  gifIcon: () => {
    return 'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=ItsukiRandomGIF/Itsuki{count}.gif'
      .replace('{count}', String(Math.floor(Math.random() * 2)));
  },
  appTitle: 'Itsuki-player',
  colorTheme: AzusaTheme.colorTheme,
  reactJKPlayerTheme: AzusaTheme.reactJKPlayerTheme,
  maintainer: '树小喵-录播@bilibili',
  maintainerTooltip: '',
  maintinerURL: 'https://live.bilibili.com/790566',
};
