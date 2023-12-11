import skinTemplate, { randomChoice } from './template';
import APMSkins from './APMSkins';

const { gifs } = APMSkins['大力播放器']!;

export default () =>
  skinTemplate({
    playerBanner:
      'https://article.biliimg.com/bfs/article/6410350acbdd9707dfa4769d0c2f1e780768d153.png',
    playerBannerMobile: async () =>
      new Promise<string>((resolve) => {
        resolve(
          'https://img-baofun.zhhainiao.com/pcwallpaper_ugc_mobile/preview/6c47b1ed421707815dc3e28f74a5a6db_preview.mp4',
        );
      }),
    playerBackgroundMobileVideo: true,
    playerBackground: async () =>
      new Promise<string>((resolve) => {
        resolve(
          'https://img-baofun.zhhainiao.com/pcwallpaper_ugc/preview/994eec6c1203516f81c2db75f02c3789_preview.mp4',
        );
      }),
    playerBackgroundVideo: true,
    gifs,
    gifIcon: () => randomChoice(gifs) as string,
    appTitle: '大力播放器',
    colorTheme: {
      generalTheme: 'dark',
      // color for icons such as add to current playlist, on the right panel
      playListIconColor: '#00bfff',
      songListIconColor: '#00bfff',
      iconDisableColor: '##adadad',
      // colors for playlist caption on the right panel
      myPlayListCaptionColor: '#00bfff',
      // similar to above; depreciating?
      playlistCaptionColor: '#00bfff',
      // color for icons on hte left panel. depreciating?
      songIconColor: '#00bfff',
      songListColumnHeaderColor: '#00bfff',
      // colors for song caption on the left panel. depreciating?
      uploaderCaptionColor: '#00bfff',
      lyricActiveColor: '#c660e7',
      lyricInactiveColor: '#4d388f',
      songListShadowStyle:
        '-4px 5px 6px 2px #1e90ff, 4px -3px 2px 0px #0070ff, 1px 1px 0px 2px #87ceeb',
      lyricImgShadowStyle:
        ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
      PCBackgroundColor: 'rgba(30,30,30,0.85)',
      MobileBackgroundColor: '#1E1E1E',
      FavBackgroundColor: 'rgba(30,30,30,0.5)',
      FavBackgroundColorSolid: 'rgba(30,30,30,1)',
      FavAlternateBackgroundColor: 'rgba(41,41,41,0.5)',
      scrollbarColor: '#00bfff',
      favMobileBorder: '1px solid white',
      clickHoldBackground: 'rebeccapurple',
      palette: {
        palette: {
          primary: {
            // light: will be calculated from palette.primary.main,
            main: '#00bfff',
            background: 'black',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
          },
          secondary: {
            main: '#00bfff',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00',
          },
          // Used by `getContrastText()` to maximize the contrast between
          // the background and the text.
          contrastThreshold: 3,
          // Used by the functions below to shift a color's luminance by approximately
          // two indexes within its tonal palette.
          // E.g., shift from #00bfff 500 to #00bfff 300 or #00bfff 700.
          tonalOffset: 0.2,
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: '1.4em',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#00bfff',
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                color: '#00bfff',
              },
            },
          },
          MuiDialogContentText: {
            styleOverrides: {
              root: {
                color: '#00bfff',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#00bfff',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#00bfff',
                '&.Mui-disabled': {
                  color: '#00bfff',
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: 'ivory',
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: '#00bfff',
              },
              input: {
                color: '#00bfff',
                '&.Mui-disabled': {
                  color: '#00bfff',
                  WebkitTextFillColor: 'rgba(0,191,255,0.35)',
                },
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              input: {
                color: '#00bfff',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                color: '#00bfff',
                '&:hover': {
                  backgroundColor: 'rebeccapurple',
                  color: '#00bfff',
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: '#00bfff',
                '&:hover': {
                  backgroundColor: 'rebeccapurple',
                  color: '#00bfff',
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                color: '#00bfff',
                '&:hover': {
                  backgroundColor: 'rebeccapurple',
                  color: '#00bfff',
                },
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: '#00bfff',
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: {
                color: '#00bfff',
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              root: {
                color: '#00bfff',
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              select: {
                color: '#00bfff',
              },
              icon: {
                color: '#00bfff',
              },
              nativeInput: {
                color: '#00bfff',
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: '#00bfff',
              },
            },
          },
          MuiFormControlLabel: {
            styleOverrides: {
              label: {
                color: '#00bfff',
              },
            },
          },
        },
      },
    },
    reactJKPlayerTheme: {
      sliderColor: '#00bfff',
    },
    maintainer: '起名字什么的真困难啊@bilibili',
    maintainerTooltip: '莉德维德我诶你！！',
    maintinerURL: 'https://live.bilibili.com/22742508',
  });
