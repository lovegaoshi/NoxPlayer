// this is a pink/light theme.
// replace @.+avif to none.
const gifs = [
  'https://i0.hdslb.com/bfs/new_dyn/df8ed34c74653da7f89ffd49e96f0ef11846208014.png',
  'https://i0.hdslb.com/bfs/new_dyn/3d61f99a8b5114fa9648e5a572cc6c421846208014.jpg',
  'https://i0.hdslb.com/bfs/new_dyn/2c10f6fba49ce0ff52e8fc5c010374531846208014.jpg',
  'https://i0.hdslb.com/bfs/new_dyn/1d87a5ed22d20aca658a6e96675a08af1846208014.jpg',
  'https://i0.hdslb.com/bfs/new_dyn/4a32a8f461331a7667f4386397b7f8191846208014.jpg@720w_720h_1e_1c_!web-dynamic.avif',
  'https://i0.hdslb.com/bfs/new_dyn/002902bf229e9d9d8f20315bf926c0684115836.png@416w_416h_1e_1c_!web-dynamic.avif',
  'https://i0.hdslb.com/bfs/new_dyn/f7bc2c0904f5fff8b2b9a4fb37d817eb1846208014.png@960w_960h_1e_1c_!web-dynamic.avif',
  'https://i0.hdslb.com/bfs/new_dyn/2058010a3b63bf62ee2ce73b11eddfeb1846208014.jpg@960w_1080h_1e_1c_!web-dynamic.avif',
  'https://i0.hdslb.com/bfs/new_dyn/bcfb0864fd23e2abded663fa9daa91a11846208014.jpg@720w_720h_1e_1c_!web-dynamic.avif',
];

export default {
  playerBanner: 'https://article.biliimg.com/bfs/article/41ead2cf9db8946f335d4d66cc9044dc8b961aa4.png',
  playerBannerMobile: 'https://article.biliimg.com/bfs/article/29af4ddfe6e9a2459b02ccb8181b414080babd65.png',
  playerBackground: 'https://img-baofun.zhhainiao.com/pcwallpaper_ugc/preview/2d4813a4df47201b40f8be2a71d60bf1_preview.mp4',
  playerBackgroundVideo: true,
  gifs,
  gifIcon: () => {
    return gifs[Math.floor(Math.random() * gifs.length) >> 0];
  },
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
    songListShadowStyle: '-4px 5px 6px 2px #ffc1cc, 4px -3px 2px 0px #ffc1cc, 1px 1px 0px 2px #ffcff1',
    lyricImgShadowStyle: ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
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
};
