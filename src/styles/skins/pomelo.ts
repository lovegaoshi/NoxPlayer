import { fetchVideoPlayUrl } from '@APM/utils/mediafetch/bilivideo';
import skinTemplate, { randomChoice } from './template';
// this is a pink/light theme.

const gifs = [
  'https://article.biliimg.com/bfs/article/313c42ec86c5bdaa13ba3d8a5633e696bfd2412f.gif',
  'https://article.biliimg.com/bfs/article/f961bb02daccadcc19daf191e5540e633fe4b104.gif',
  'https://article.biliimg.com/bfs/article/5fb01231dff56e8b089126c6edfa6fc68c7b2be7.gif',
  'https://article.biliimg.com/bfs/article/8dc01b02cd7dfeb8871dea607b4f191a5be80f64.gif',
  'http://i0.hdslb.com/bfs/garb/e0434d5ee3ad0be34377ac0df78a6075cabf34e8.png',
  'http://i0.hdslb.com/bfs/garb/e4bc12886185357562cd59d8d18257a8ad19d9e1.png',
  'http://i0.hdslb.com/bfs/garb/9cf9238d185de745850b6b7c0468bb0654e9c30e.png',
  'http://i0.hdslb.com/bfs/garb/e16087b121cb48dd34bab5a02ffc5601149b5ca4.png',
  'http://i0.hdslb.com/bfs/garb/802462836f55a35bf09d6ad00e4ba52ed101d2f6.png',
  'http://i0.hdslb.com/bfs/garb/22113e3f01f64e781754bf1297d3d201fb97a92c.png',
  'http://i0.hdslb.com/bfs/garb/bf79e7b0df21f7a75a640ca5a6e76c9ed687acd3.png',
  'http://i0.hdslb.com/bfs/garb/f4d9ae969e692ea086a4382698cf78f651bbc975.png',
  'http://i0.hdslb.com/bfs/garb/c2d0bac0d3d98b3424cd58d6e68d79bd352359f6.png',
  'http://i0.hdslb.com/bfs/garb/2cceff64dab9ab0d1ec389bda04655390fe4aea4.png',
  'http://i0.hdslb.com/bfs/garb/ec5cc3729cffbfd6acafa9f6c7b9171f585299e3.png',
  'http://i0.hdslb.com/bfs/garb/74bbe0803168dc873a7e97334b0bab85d337a39c.png',
];
export default skinTemplate({
  playerBanner:
    'http://i0.hdslb.com/bfs/space/ac7ed8c017edce6d376707b7ce3a68302edb3c50.png',
  playerBannerMobile: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'https://article.biliimg.com/bfs/article/29af4ddfe6e9a2459b02ccb8181b414080babd65.png',
      );
    }),
  playerBackground: () => fetchVideoPlayUrl('BV1Yv4y1C7K5'),
  playerBackgroundVideo: true,
  // 'http://i0.hdslb.com/bfs/live/room_bg/9ec58de4a73fadb0024ff80db13416093a2b158b.jpg@1920w_1080h.webp',
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: '电妮播放器',
  desktopTheme: 'dark',
  colorTheme: {
    generalTheme: 'light',
    // these are adapted from the original azusa player; eventually will be trnaslated into palettes.
    // color for icons such as add to current playlist, on the right panel
    playListIconColor: '#ff1493',
    songListIconColor: '#ff1493',
    iconDisableColor: '##adadad',
    // colors for playlist caption on the right panel
    myPlayListCaptionColor: '#ff1493',
    // similar to above; depreciating?
    playlistCaptionColor: '#ff1493',
    // color for icons on hte left panel. depreciating?
    songListColumnHeaderColor: 'black',
    // color for icons on hte left panel. depreciating?
    songIconColor: '#8e5fab',
    // colors for song caption on the left panel. depreciating?
    uploaderCaptionColor: '#ff1493',
    lyricActiveColor: '#c660e7',
    lyricInactiveColor: '#4d388f',
    songListShadowStyle:
      '-4px 5px 6px 2px #ffc1cc, 4px -3px 2px 0px #ffc1cc, 1px 1px 0px 2px #ffcff1',
    lyricImgShadowStyle:
      ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
    PCBackgroundColor: undefined,
    MobileBackgroundColor: 'white',
    FavBackgroundColor: 'rgba(255,255,255,0.9)',
    FavBackgroundColorSolid: 'rgba(255,255,255,1)',
    FavAlternateBackgroundColor: 'rgba(242,242,242,0.5)',
    scrollbarColor: '#ffbcd9',
    favMobileBorder: '1px solid #ff1493',
    clickHoldBackground: '#ffa6c9',
    palette: {
      palette: {
        primary: {
          // light: will be calculated from palette.primary.main,
          main: '#ff1493',
        },
        secondary: {
          // light: will be calculated from palette.primary.main,
          main: '#ff1493',
        },
      },
      components: {
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              fontSize: '1.4em',
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              color: '#ff1493',
              '&:hover': {
                backgroundColor: 'rgba(255,188,217,0.6)',
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              color: '#ff1493',
            },
            input: {
              color: '#ff1493',
            },
          },
        },
        MuiFormControlLabel: {
          styleOverrides: {
            label: {
              color: '#ff1493',
            },
            root: {
              color: '#ff1493',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              color: '#ff1493',
            },
          },
        },
      },
    },
  },
  reactJKPlayerTheme: {
    sliderColor: '#ffbcd9',
  },
  maintainer: '食梦莲lotus@bilibili',
  maintainerTooltip: '关注弃车人的骄傲spiderman安妮直播间27484357',
  maintinerURL: 'https://live.bilibili.com/27484357',
});
