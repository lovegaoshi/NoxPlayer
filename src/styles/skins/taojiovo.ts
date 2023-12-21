import skinTemplate from './template';
// this is a pink/light theme.
import APMSkins from './APMSkins';

const { gifs, backgroundImagesLandscape } = APMSkins['桃几OvO']!;

export default () =>
  skinTemplate({
    playerBanner:
      'https://article.biliimg.com/bfs/article/41ead2cf9db8946f335d4d66cc9044dc8b961aa4.png',
    playerBackground: backgroundImagesLandscape,

    gifs,
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
