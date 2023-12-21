import skinTemplate from './template';
import APMSkins from './APMSkins';

// this is a pink/light theme.

const { gifs, backgroundImagesLandscape } = APMSkins['VV播放器']!;

export default () =>
  skinTemplate({
    playerBanner:
      'https://i0.hdslb.com/bfs/article/3ff6c3cd3a88179cc0e582e55f6ac1fdf8c38f97.png',
    // "https://i0.hdslb.com/bfs/new_dyn/2f5703dc027b86cb303ec8c894e99ca835817909.jpg",
    playerBackground: backgroundImagesLandscape,
    // https://i2.hdslb.com/bfs/archive/1b21245dbec6e4f50c870e9e64f5b17c0369316d.jpg,
    // 'https://i2.hdslb.com/bfs/archive/1b21245dbec6e4f50c870e9e64f5b17c0369316d.jpg',
    // 'https://i0.hdslb.com/bfs/archive/27075a55293c7e21c351623ceb66d106c01bedf6.png',
    // 'https://i0.hdslb.com/bfs/archive/933a53696340fa985fdacc8f0d0b20d21752367b.jpg',
    // 'https://i1.hdslb.com/bfs/archive/0b3e74a2e2436df6fd3746dd4cde042dc5dd7816.jpg',
    // 'https://i0.hdslb.com/bfs/new_dyn/8fe70bd7c7521b0cc7866bbb372c5bb127912295.png',

    gifs,
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
