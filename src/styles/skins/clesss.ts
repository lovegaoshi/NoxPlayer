import skinTemplate from './template';
import APMSkins from './APMSkins';

const { gifs, backgroundImagesLandscape } = APMSkins['克√播放器']!;

export default () =>
  skinTemplate({
    playerBanner:
      'https://article.biliimg.com/bfs/article/6410350acbdd9707dfa4769d0c2f1e780768d153.png',
    playerBackground: backgroundImagesLandscape,
    gifs,
    appTitle: '克√播放器',
    colorTheme: {
      generalTheme: 'dark',
      // color for icons such as add to current playlist, on the right panel
      playListIconColor: '#d3d3d3',
      songListIconColor: '#d3d3d3',
      iconDisableColor: '##adadad',
      // colors for playlist caption on the right panel
      myPlayListCaptionColor: '#d3d3d3',
      // similar to above; depreciating?
      playlistCaptionColor: 'red',
      // color for icons on hte left panel. depreciating?
      songIconColor: 'red',
      songListColumnHeaderColor: '#d3d3d3',
      // colors for song caption on the left panel. depreciating?
      uploaderCaptionColor: '#d3d3d3',
      lyricActiveColor: '#c660e7',
      lyricInactiveColor: '#4d388f',
      songListShadowStyle:
        '-4px 5px 6px 2px #ff0000, 4px -3px 2px 0px #ff0028, 1px 1px 0px 2px #ff2400',
      lyricImgShadowStyle:
        ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
      PCBackgroundColor: 'rgba(30,30,30,0.85)',
      MobileBackgroundColor: '#1E1E1E',
      FavBackgroundColor: 'rgba(30,30,30,0.5)',
      FavBackgroundColorSolid: 'rgba(30,30,30,1)',
      FavAlternateBackgroundColor: 'rgba(61,61,61,0.5)',
      scrollbarColor: '#dc143c',
      favMobileBorder: '1px solid white',
      clickHoldBackground: 'red',
      palette: {
        palette: {
          primary: {
            // light: will be calculated from palette.primary.main,
            main: '#dc143c',
            background: 'black',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
          },
          secondary: {
            main: '#dc143c',
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
                color: '#d3d3d3',
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                color: '#d3d3d3',
              },
            },
          },
          MuiDialogContentText: {
            styleOverrides: {
              root: {
                color: '#d3d3d3',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#d3d3d3',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                backgroundColor: '#1E1E1E',
                color: '#d3d3d3',
                '&.Mui-disabled': {
                  backgroundColor: '#1E1E1E',
                  color: '#d3d3d3',
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
                color: '#d3d3d3',
              },
              input: {
                color: '#d3d3d3',
                '&.Mui-disabled': {
                  color: '#d3d3d3',
                  WebkitTextFillColor: 'rgba(211,211,211,0.35)',
                },
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              input: {
                color: '#d3d3d3',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                color: 'red',
                '&:hover': {
                  backgroundColor: '#e8000d',
                  color: '#d3d3d3',
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: 'red',
                '&:hover': {
                  backgroundColor: '#e8000d',
                  color: '#d3d3d3',
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                color: '#d3d3d3',
                '&:hover': {
                  backgroundColor: '#e8000d',
                  color: '#d3d3d3',
                },
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                color: 'red',
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: {
                color: '#d3d3d3',
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              root: {
                color: '#d3d3d3',
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              select: {
                color: '#d3d3d3',
              },
              icon: {
                color: '#d3d3d3',
              },
              nativeInput: {
                color: '#d3d3d3',
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: '#d3d3d3',
              },
            },
          },
          MuiFormControlLabel: {
            styleOverrides: {
              label: {
                color: '#d3d3d3',
              },
            },
          },
        },
      },
    },
    reactJKPlayerTheme: {
      sliderColor: 'red',
    },
    maintainer: '内德维德的军火库@bilibili',
    maintainerTooltip: '快滚',
    maintinerURL: 'https://live.bilibili.com/5424',
  });
