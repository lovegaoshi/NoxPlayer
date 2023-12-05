import { fetchVideoPlayUrl } from '@APM/utils/mediafetch/bilivideo';
import skinTemplate, { randomChoice } from './template';
import APMSkins from './APMSkins';

const { gifs } = APMSkins['电梓播放器']!;

const randomPortraitBackground = randomChoice([
  'https://i0.hdslb.com/bfs/garb/item/aabad1485d211701be33be155a3bba88231453ba.jpg',
  'https://i0.hdslb.com/bfs/garb/item/fbdbf4068ea22d36ce223e83166b0b22f684d656.jpg',
  'https://i0.hdslb.com/bfs/garb/item/70ca7e98464ea5678a328615a7581cf42fb4d1ea.jpg',
  'https://i0.hdslb.com/bfs/garb/item/00aa213a3f4c3ccc5addd18c21e71ad9ba004bae.jpg',
  'https://i0.hdslb.com/bfs/garb/item/ba3d3334062b43e16001ca61bab2bc4af404da27.jpg',
  'https://i0.hdslb.com/bfs/garb/item/8cda150169756811847d07817b3ce0c0f0d52cc2.jpg',
  'https://i0.hdslb.com/bfs/garb/item/2f5968ae6993f4cd190c4dd16adac61c8376e08e.jpg',
  'https://i0.hdslb.com/bfs/garb/item/56549820b2458a440b0eaa97b27fd3fba3232375.jpg',
  'https://i0.hdslb.com/bfs/garb/item/37fc8d2acf41b0fe7ec3b9732297d8e2832f21e4.png',
  'https://i0.hdslb.com/bfs/garb/item/589adb63eae72b89f2022b040c333a42125b7ae9.jpg',
  // 'https://cdn.donmai.us/sample/b8/10/__azusa_nijisanji_and_2_more_drawn_by_bsmycc__sample-b8106d3890e42fc9bfcd896a648a6c80.jpg'
]) as string;

export default skinTemplate({
  playerBanner:
    'https://github.com/kenmingwang/azusa-player/blob/master/public/img/bg3.png?raw=true',
  playerBannerMobile: async () =>
    new Promise<string>((resolve) => {
      resolve(randomPortraitBackground);
    }),
  playerBackgroundMobileVideo: randomPortraitBackground.includes('.mp4'),
  playerBackground: () => fetchVideoPlayUrl('BV11S4y1d7v9'), // BV1Sb4y1i79D
  playerBackgroundVideo: true,
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: 'Azusa-player',
  colorTheme: {
    generalTheme: 'light',
    // these are adapted from the original azusa player; eventually will be trnaslated into palettes.
    // color for icons such as add to current playlist, on the right panel
    playListIconColor: '#ab5fff',
    songListIconColor: '#ab5fff',
    iconDisableColor: '##adadad',
    // colors for playlist caption on the right panel
    myPlayListCaptionColor: '#9600af94',
    // similar to above; depreciating?
    playlistCaptionColor: '#9c55fac9',
    // color for icons on hte left panel. depreciating?
    songListColumnHeaderColor: 'black',
    // color for icons on hte left panel. depreciating?
    songIconColor: '#8e5fab',
    // colors for song caption on the left panel. depreciating?
    uploaderCaptionColor: '#ab5fff',
    lyricActiveColor: '#c660e7',
    lyricInactiveColor: '#4d388f',
    songListShadowStyle:
      '-4px 5px 6px 2px #a658f933, 4px -3px 2px 0px #a658f933, 1px 1px 0px 2px #0000001f',
    lyricImgShadowStyle:
      ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
    PCBackgroundColor: undefined,
    MobileBackgroundColor: 'white',
    FavListBackgroundColor: 'rgba(255,255,255,0.6)',
    FavBackgroundColor: 'rgba(255,255,255,0.9)',
    FavBackgroundColorSolid: 'rgba(255,255,255,1)',
    FavAlternateBackgroundColor: 'rgba(242,242,242,0.5)',
    scrollbarColor: '#c6acfc',
    favMobileBorder: '1px solid #ab5fff',
    clickHoldBackground: 'lightgrey',
    palette: {
      palette: {
        primary: {
          // light: will be calculated from palette.primary.main,
          main: '#ab5fff',
        },
        secondary: {
          // light: will be calculated from palette.primary.main,
          main: '#ce93d8',
        },
      },
      components: {
        MuiListItemButton: {
          styleOverrides: {
            root: {
              color: '#ab5fff',
            },
          },
        },
      },
    },
  },
  reactJKPlayerTheme: {
    sliderColor: '#8c98ff',
  },
  maintainer: 'kenmingwang@github',
  maintainerTooltip: '',
  maintinerURL: 'https://live.bilibili.com/510',
});
