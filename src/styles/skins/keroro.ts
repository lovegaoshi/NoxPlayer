import skinTemplate from './template';
import APMSkins from './APMSkins';

const { gifs, backgroundImagesLandscape } = APMSkins['蛙吹Keroro']!;

export default () =>
  skinTemplate({
    playerBanner:
      'https://i0.hdslb.com/bfs/article/b492fd7ad584a78318945a152303c7003493085134719196.jpg',

    playerBackground: backgroundImagesLandscape,

    gifs,
    appTitle: '蛙蛙播放器',
    desktopTheme: 'light',
    colorTheme: {
      generalTheme: 'dark',
      // color for icons such as add to current playlist, on the right panel
      playListIconColor: '#BEDBED',
      songListIconColor: '#BEDBED',
      iconDisableColor: '##adadad',
      // colors for playlist caption on the right panel
      myPlayListCaptionColor: '#BEDBED',
      // similar to above; depreciating?
      playlistCaptionColor: '#BEDBED',
      // color for icons on hte left panel. depreciating?
      songIconColor: '#BEDBED',
      songListColumnHeaderColor: '#BEDBED',
      // colors for song caption on the left panel. depreciating?
      uploaderCaptionColor: '#BEDBED',
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
      scrollbarColor: '#BEDBED',
      favMobileBorder: '1px solid white',
      clickHoldBackground: 'rebeccapurple',
      palette: {
        palette: {
          primary: {
            // light: will be calculated from palette.primary.main,
            main: '#BEDBED',
            background: 'black',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
          },
          secondary: {
            main: '#BEDBED',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00',
          },
          // Used by `getContrastText()` to maximize the contrast between
          // the background and the text.
          contrastThreshold: 3,
          // Used by the functions below to shift a color's luminance by approximately
          // two indexes within its tonal palette.
          // E.g., shift from #BEDBED 500 to #BEDBED 300 or #BEDBED 700.
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
                color: '#BEDBED',
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                color: '#BEDBED',
              },
            },
          },
          MuiDialogContentText: {
            styleOverrides: {
              root: {
                color: '#BEDBED',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#BEDBED',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#BEDBED',
                '&.Mui-disabled': {
                  color: '#BEDBED',
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
                color: '#BEDBED',
              },
              input: {
                color: '#BEDBED',
                '&.Mui-disabled': {
                  color: '#BEDBED',
                  WebkitTextFillColor: 'rgba(0,191,255,0.35)',
                },
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              input: {
                color: '#BEDBED',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                color: '#BEDBED',
                '&:hover': {
                  backgroundColor: 'rebeccapurple',
                  color: '#BEDBED',
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: '#BEDBED',
                '&:hover': {
                  backgroundColor: 'rebeccapurple',
                  color: '#BEDBED',
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                color: '#BEDBED',
                '&:hover': {
                  backgroundColor: 'rebeccapurple',
                  color: '#BEDBED',
                },
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: '#BEDBED',
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: {
                color: '#BEDBED',
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              root: {
                color: '#BEDBED',
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              select: {
                color: '#BEDBED',
              },
              icon: {
                color: '#BEDBED',
              },
              nativeInput: {
                color: '#BEDBED',
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: '#BEDBED',
              },
            },
          },
          MuiFormControlLabel: {
            styleOverrides: {
              label: {
                color: '#BEDBED',
              },
            },
          },
        },
      },
    },
    reactJKPlayerTheme: {
      sliderColor: '#BEDBED',
    },
    maintainer: '-哆啦A林-@bilibili',
    maintainerTooltip: '给你一拳',
    maintinerURL: 'https://live.bilibili.com/28861834',
  });
