import { fetchVideoPlayUrl } from '@APM/utils/mediafetch/bilivideo';
import skinTemplate, { randomChoice } from './template';

// this is a pink/light theme.

const gifs = [
  'http://i0.hdslb.com/bfs/garb/9d035f81ecbb9d2cb5f8965eb939f6edadd1ad5f.png',
  'http://i0.hdslb.com/bfs/garb/225e977d9e9970aa2626c8dc953022496abb6cf2.png',
  'http://i0.hdslb.com/bfs/garb/8530e80244907c106cd78bf33eaefb49766da6af.png',
  'http://i0.hdslb.com/bfs/garb/6419ffdc524f9594d4a5880c795e331fb33e8c4d.png',
  'http://i0.hdslb.com/bfs/garb/96919cc30c25c3f9d8f1f4536b09cb08d047a609.png',
  'http://i0.hdslb.com/bfs/garb/71de7c29e8c2d7879da363409829c8ff82f9aa72.png',
  'http://i0.hdslb.com/bfs/garb/eb0be385d49dbb63e1f19619922051d0eb01fa6c.png',
  'http://i0.hdslb.com/bfs/garb/0e0017f8767e110105caf12ed47baee1df15089a.png',
  'http://i0.hdslb.com/bfs/garb/3156c1688298cd9e9a8bce75ea7c71fbbef96789.png',
  'http://i0.hdslb.com/bfs/garb/d868a9e10895eef1f565746a727e8286319f8d7a.png',
  'http://i0.hdslb.com/bfs/garb/705197bcb5cb3e652e3955749401d8d48ac7997a.png',
  'http://i0.hdslb.com/bfs/garb/1c0434eb2bc03ef4dc6d91b07e0778046e7634ab.png',
  'http://i0.hdslb.com/bfs/garb/085461dd431e1c42958959332edd016d4325e292.png',
  'http://i0.hdslb.com/bfs/garb/a2c1b730905a876ba0cdcf42c12b674b90b86038.png',
  'http://i0.hdslb.com/bfs/garb/001887ba703fd72a87d4ab3b99cb3d6c0ecfb154.png',
  'https://i0.hdslb.com/bfs/garb/9b057e3283e370c0acff0c7e409009d015fb432a.png',
  'https://i0.hdslb.com/bfs/garb/d49daf91dbc954fc76bec95d99fd763aa6acd629.png',
  'https://i0.hdslb.com/bfs/garb/8f3d7b02fcfe3b9a42e23cab4b081b8c451a7fdf.png',
  'https://i0.hdslb.com/bfs/garb/f21c084660e477a82d9c8f52d7e635a2c7e16de6.png',
  'https://i0.hdslb.com/bfs/garb/282cc9245f40bd41dd94bbe41cd139a5e9b7201e.png',
  'https://i0.hdslb.com/bfs/garb/ff4a7d43d7c3447da79a73f9a518753018ca1e78.png',
  'https://i0.hdslb.com/bfs/garb/ee2901ff4eb46efac37b97d22afe8c76ee18ae5a.png',
  'https://i0.hdslb.com/bfs/garb/d054313df610e081b1d63fc6bebabe7d6df62c7f.png',
  'https://i0.hdslb.com/bfs/garb/8271d173aa36f41633c775814173829c0595f751.png',
  'https://i0.hdslb.com/bfs/garb/35cb941c7bb2676f8c17cec8e08abdc3da5da8ca.png',
  'https://i0.hdslb.com/bfs/garb/19e1834917ee1b5d84b40a72b70cd58e7d926ddf.png',
  'https://i0.hdslb.com/bfs/garb/d04decc6b1d38d07c5df7ad54fd42e258391f372.png',
  'https://i0.hdslb.com/bfs/garb/82069a80fbeae7795d63568d89b4599d900a8bd1.png',
  'https://i0.hdslb.com/bfs/garb/b2de8c29a9bbbe4210390e2822b1d14666ec26fc.png',
  'https://i0.hdslb.com/bfs/garb/73731e0b8e6af9bd7c899947cc981a68c28a66b8.png',
];

export default skinTemplate({
  playerBanner:
    'https://i0.hdslb.com/bfs/article/3ff6c3cd3a88179cc0e582e55f6ac1fdf8c38f97.png',
  playerBannerMobile: () => fetchVideoPlayUrl('BV1Da411M7ti'),
  // "https://i0.hdslb.com/bfs/new_dyn/2f5703dc027b86cb303ec8c894e99ca835817909.jpg",
  playerBackgroundMobileVideo: true,
  playerBackground: () =>
    fetchVideoPlayUrl(randomChoice(['BV1h24y1T78N', 'BV13w411m7iV'])),
  playerBackgroundVideo: true,
  // playerBackground: async () => new Promise<string>((resolve) => { resolve('https://i2.hdslb.com/bfs/archive/1b21245dbec6e4f50c870e9e64f5b17c0369316d.jpg'); }),
  // 'https://i2.hdslb.com/bfs/archive/1b21245dbec6e4f50c870e9e64f5b17c0369316d.jpg',
  // 'https://i0.hdslb.com/bfs/archive/27075a55293c7e21c351623ceb66d106c01bedf6.png',
  // 'https://i0.hdslb.com/bfs/archive/933a53696340fa985fdacc8f0d0b20d21752367b.jpg',
  // 'https://i1.hdslb.com/bfs/archive/0b3e74a2e2436df6fd3746dd4cde042dc5dd7816.jpg',
  // 'https://i0.hdslb.com/bfs/new_dyn/8fe70bd7c7521b0cc7866bbb372c5bb127912295.png',

  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: '电姨播放器',
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
    FavListBackgroundColor: 'rgba(255,255,255,0.6)',
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
    sliderColor: '#ff1493',
  },
  maintainer: '薇薇单推人@bilibili',
  maintainerTooltip: '温柔 安定 后半夜黑听天堂 直播间22924075',
  maintinerURL: 'https://live.bilibili.com/22924075',
});
