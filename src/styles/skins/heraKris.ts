import skinTemplate, { randomChoice } from './template';
import APMSkins from './APMSkins';

const { gifs } = APMSkins['猫头鹰播放器']!;

export default () =>
  skinTemplate({
    playerBanner:
      'https://article.biliimg.com/bfs/article/9c49d0133498d844869438569cf36d96ffe56234.png',
    playerBannerMobile: async () =>
      'https://article.biliimg.com/bfs/article/665f1975a070f013580832fef95621aef37a1b2c.png',

    playerBackground: async () =>
      'http://i0.hdslb.com/bfs/live/room_bg/f969cfa685038d4d8210c9aa2844677bc5a58eeb.jpg',

    gifs,
    gifIcon: () => randomChoice(gifs) as string,
    appTitle: 'HeraKris-player',
    colorTheme: {
      generalTheme: 'dark',
      // color for icons such as add to current playlist, on the right panel
      playListIconColor: '#90ee90',
      songListIconColor: '#90ee90',
      iconDisableColor: '##adadad',
      // colors for playlist caption on the right panel
      myPlayListCaptionColor: '#90ee90',
      // similar to above; depreciating?
      playlistCaptionColor: '#90ee90',
      // color for icons on hte left panel. depreciating?
      songIconColor: '#90ee90',
      songListColumnHeaderColor: '#90ee90',
      // colors for song caption on the left panel. depreciating?
      uploaderCaptionColor: '#90ee90',
      lyricActiveColor: '#c660e7',
      lyricInactiveColor: '#4d388f',
      songListShadowStyle:
        '-4px 5px 6px 2px #90ee90, 4px -3px 2px 0px #90ee90, 1px 1px 0px 2px #00ff7f',
      lyricImgShadowStyle:
        ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
      PCBackgroundColor: 'rgba(30,30,30,0.85)',
      MobileBackgroundColor: '#1E1E1E',
      FavBackgroundColor: 'rgba(30,30,30,0.5)',
      FavBackgroundColorSolid: 'rgba(30,30,30,1)',
      FavAlternateBackgroundColor: 'rgba(61,61,61,0.5)',
      scrollbarColor: '#90ee90',
      favMobileBorder: '1px solid white',
      clickHoldBackground: '#6F116F',
      palette: {
        palette: {
          primary: {
            // light: will be calculated from palette.primary.main,
            main: '#90ee90',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
            background: 'black',
          },
          secondary: {
            main: '#90ee90',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00',
          },
          // Used by `getContrastText()` to maximize the contrast between
          // the background and the text.
          contrastThreshold: 3,
          // Used by the functions below to shift a color's luminance by approximately
          // two indexes within its tonal palette.
          // E.g., shift from Red 500 to Red 300 or Red 700.
          tonalOffset: 0.2,
          background: {
            default: '#000000',
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
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#90ee90',
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                color: '#90ee90',
              },
            },
          },
          MuiDialogContentText: {
            styleOverrides: {
              root: {
                color: '#90ee90',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#90ee90',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#90ee90',
                '&.Mui-disabled': {
                  backgroundColor: '1E1E1E',
                  color: '#90ee90',
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                backgroundColor: '1E1E1E',
                color: 'ivory',
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: '#90ee90',
              },
              input: {
                color: '#90ee90',
                '&.Mui-disabled': {
                  WebkitTextFillColor: 'rgba(144,238,144,0.35)',
                },
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              input: {
                color: '#90ee90',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                color: '#90ee90',
                '&:hover': {
                  backgroundColor: '#6F116F',
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: '#90ee90',
                '&:hover': {
                  backgroundColor: '#6F116F',
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                color: '#90ee90',
                '&:hover': {
                  backgroundColor: '#6F116F',
                },
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: '#90ee90',
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: {
                color: '#90ee90',
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              root: {
                color: '#90ee90',
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              select: {
                color: '#90ee90',
              },
              icon: {
                color: '#90ee90',
              },
              nativeInput: {
                color: '#90ee90',
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: '#90ee90',
              },
            },
          },
          MuiFormControlLabel: {
            styleOverrides: {
              label: {
                color: '#90ee90',
              },
            },
          },
        },
      },
    },
    reactJKPlayerTheme: {
      sliderColor: '#90ee90',
    },
    maintainer: '-哆啦A林-@bilibili',
    maintainerTooltip: '给你一拳',
    maintinerURL: 'https://live.bilibili.com/28861834',
  });
