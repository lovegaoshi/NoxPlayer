import skinTemplate, { randomChoice } from './template';
// this is a pink/light theme.

const gifs = [
  'http://i0.hdslb.com/bfs/garb/5b116195621e8d7e6c074b956c84decaf23a9804.png',
  'http://i0.hdslb.com/bfs/garb/2d8520e9c94215c6a51852a1e0b57c85a1dd99b4.png',
  'http://i0.hdslb.com/bfs/garb/b995c0b95915c221859cf085b159cb7b4ea18e38.png',
  'http://i0.hdslb.com/bfs/garb/940adc3751bb410ca61a285f56eb8f0817735750.png',
  'http://i0.hdslb.com/bfs/garb/37c61af848157a222543125b20dd5fe15d1ed189.png',
  'http://i0.hdslb.com/bfs/garb/367af60e18936c553a32823781e93f8cc4db95de.png',
  'http://i0.hdslb.com/bfs/garb/d945c23bbce12427f10a53c1df66c3f826c816e1.png',
  'http://i0.hdslb.com/bfs/garb/497909cb79ef41f07f1770520aabc43be0d4dcfd.png',
  'http://i0.hdslb.com/bfs/garb/143ab5edf65520736894c944b0a55cc3a0974fd9.png',
  'http://i0.hdslb.com/bfs/garb/833263ba1de5130be515eefdeacb65c54bdc7581.png',
  'http://i0.hdslb.com/bfs/garb/e4ab08107e5b2789365d067e0b2c14987bfa2ecd.png',
  'http://i0.hdslb.com/bfs/garb/bbfb8d52222ee945975645cfe992af7137db3a8e.png',
  'http://i0.hdslb.com/bfs/garb/661517bad77b2db7adb62e1c1f1f9fc8d9975ef2.png',
  'http://i0.hdslb.com/bfs/garb/acd4d52fe2eecc5a644263bb843ab44b782598a4.png',
  'http://i0.hdslb.com/bfs/garb/cba7ac6206f3426238e9d5c03cb13146540a3a5a.png',
  'http://i0.hdslb.com/bfs/garb/58f10533673b83be994e8acdce6d6e1b1285551e.png',
  'http://i0.hdslb.com/bfs/garb/1eb91e36231db4f7e743640a87e8b63eb733c03d.png',
  'http://i0.hdslb.com/bfs/garb/346f72b0c813c88dd4f4b6a6d82b1b622fe4fbb8.png',
  'http://i0.hdslb.com/bfs/garb/3c7cf1842d05e06e59038c218cf42bef5f2806ef.png',
  'http://i0.hdslb.com/bfs/garb/66928863f213fdb7b5699aa81e3676296c9aa435.png',
  'http://i0.hdslb.com/bfs/live/4ebcebbfd93390d6fda40949dafb49af7d8f59d9.png',
  'http://i0.hdslb.com/bfs/live/64675bf02c8d5e5773c8de7b2ace767b2735ef7d.png',
  'http://i0.hdslb.com/bfs/live/3329ddd55343213f754b91f8db9e186aea43e447.png',
  'http://i0.hdslb.com/bfs/live/fbaa96ca44a92c3b81bcf1e8364019e50af9f2a8.png',
  'http://i0.hdslb.com/bfs/live/e0d222ec4217401987554641025011248b6e871d.png',
];

export default skinTemplate({
  playerBanner:
    'https://article.biliimg.com/bfs/article/41ead2cf9db8946f335d4d66cc9044dc8b961aa4.png',
  playerBannerMobile: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'https://article.biliimg.com/bfs/article/29af4ddfe6e9a2459b02ccb8181b414080babd65.png',
      );
    }),
  playerBackground: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'https://img-baofun.zhhainiao.com/pcwallpaper_ugc/preview/2d4813a4df47201b40f8be2a71d60bf1_preview.mp4',
      );
    }),
  playerBackgroundVideo: true,
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: '电姨播放器',
  desktopTheme: 'light',
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
  maintainer: '薇薇單推人@bilibili',
  maintainerTooltip: '不听桃几的有难了',
  maintinerURL: 'https://live.bilibili.com/22642754',
});
