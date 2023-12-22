import AzusaTheme from './azusa';
import skinTemplate from './template';

const gifs = [
  'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=ItsukiRandomGIF/Itsuki0.gif',
  'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=ItsukiRandomGIF/Itsuki1.gif',
];
export default () =>
  skinTemplate({
    playerBanner:
      'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=itsukibg.jpg',

    playerBackground: [
      'http://i0.hdslb.com/bfs/live/room_bg/1428a93e4a983a7a6e7ba3dc62b064e403fc8354.png',
    ],

    gifs,
    appTitle: 'Itsuki-player',
    colorTheme: AzusaTheme().colorTheme,
    reactJKPlayerTheme: AzusaTheme().reactJKPlayerTheme,
    maintainer: '树小喵-录播@bilibili',
    maintainerTooltip: '',
    maintinerURL: 'https://live.bilibili.com/790566',
  });
