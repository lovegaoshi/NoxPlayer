const gifs = [
  'https://i0.hdslb.com/bfs/new_dyn/697096d892a7193d33dbdc0edc5e2c9f5053504.gif',
  'https://i0.hdslb.com/bfs/new_dyn/d9f4d8ea6686304cefff9ce096f0f4135053504.gif',
  'https://i0.hdslb.com/bfs/new_dyn/2e678361788e9fd518fb47bc5ab15e8b5053504.gif',
  'https://i0.hdslb.com/bfs/new_dyn/26bcb47c59fb3d004bf0b93f6749da6f5053504.gif',
  'https://article.biliimg.com/bfs/article/2841b7662c4d6a32c3852f58b623e234f7f4e21a.gif',
  'http://article.biliimg.com/bfs/article/0290281b9aa9d28c522dfd8be3de4e0527eb7b2f.gif',
  'https://article.biliimg.com/bfs/article/4705df0a2f474fb37c0fbef7b68ad1efc17f47f0.gif',
  'https://article.biliimg.com/bfs/article/aac9820e8a7ef5cd6efcd929ea78bef141aadaa3.png',
  'https://article.biliimg.com/bfs/article/d52dd3ef32408d62a172d6834332a572af95a5bc.jpg',
  'https://article.biliimg.com/bfs/article/3f1fa01d6bb5f5874e7bfa91933bc5f19daf079b.jpg',
  'https://article.biliimg.com/bfs/article/a64a32a63ea592edaa7f3da0d48946d0487b8341.png',

];

export default {
  playerBanner: 'https://i0.hdslb.com/bfs/new_dyn/a6055de12310f55ac6590a86bd4008365053504.png',
  playerBannerMobile: 'https://cdn.donmai.us/original/ea/ec/__nox_nijisanji_and_3_more_drawn_by_netural__eaec50f6d554b731ffe4fcace255d0bd.png',
  playerBackground: 'http://i0.hdslb.com/bfs/live/room_bg/1428a93e4a983a7a6e7ba3dc62b064e403fc8354.png@1920w_1080h.webp',
  gifs,
  gifIcon: () => {
    return gifs[Math.floor(Math.random() * gifs.length) >> 0];
  },
  appTitle: 'Nox-player',
  colorTheme: {
    /**
         * defines the general theme is light or dark.
         */
    generalTheme: 'dark',
    /**
         * color for icons such as add to current playlist, on the right panel
         */
    playListIconColor: '#fff44f',
    songListIconColor: '#fff44f',
    iconDisableColor: '##adadad',
    /**
         * colors for playlist caption on the right panel
         */
    myPlayListCaptionColor: '#fff44f',
    /**
         * similar to above; depreciating?
         */
    playlistCaptionColor: '#fff44f',
    /**
         * color for icons on hte left panel. depreciating?
         */
    songIconColor: '#fff44f',
    songListColumnHeaderColor: '#fff44f',
    /**
         * colors for song caption on the left panel. depreciating?
         */
    uploaderCaptionColor: '#fff44f',
    lyricActiveColor: '#c660e7',
    lyricInactiveColor: '#4d388f',
    songListShadowStyle: '-4px 5px 6px 2px #f0e68c, 4px -3px 2px 0px #f0e68c, 1px 1px 0px 2px #fff8dc',
    lyricImgShadowStyle: ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
    PCBackgroundColor: 'rgba(30,30,30,0.85)',
    MobileBackgroundColor: '#1E1E1E',
    FavBackgroundColor: 'rgba(30,30,30,0.5)',
    FavBackgroundColorSolid: 'rgba(30,30,30,1)',
    FavAlternateBackgroundColor: 'rgba(61,61,61,0.5)',
    scrollbarColor: '#fff44f',
    favMobileBorder: '1px solid white',
    clickHoldBackground: 'green',
    palette: {
      palette: {
        primary: {
          // light: will be calculated from palette.primary.main,
          main: '#fff44f',
          // dark: will be calculated from palette.primary.main,
          // contrastText: will be calculated to contrast with palette.primary.main
          background: 'black',
        },
        secondary: {
          main: '#fff44f',
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
              color: '#fff44f',
            },
          },
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              color: '#fff44f',
            },
          },
        },
        MuiDialogContentText: {
          styleOverrides: {
            root: {
              color: '#fff44f',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              backgroundColor: '#1E1E1E',
              color: '#fff44f',
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              backgroundColor: '#1E1E1E',
              color: '#fff44f',
              '&.Mui-disabled': {
                backgroundColor: '1E1E1E',
                color: '#fff44f',
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
              color: '#fff44f',
            },
            input: {
              color: '#fff44f',
              '&.Mui-disabled': {
                WebkitTextFillColor: 'rgba(255,244,79,0.35)',
              },
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            input: {
              color: '#fff44f',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              color: '#fff44f',
              '&:hover': {
                backgroundColor: 'green',
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              color: '#fff44f',
              '&:hover': {
                backgroundColor: 'green',
              },
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              color: '#fff44f',
              '&:hover': {
                backgroundColor: 'green',
              },
            },
          },
        },
        MuiListItemIcon: {
          styleOverrides: {
            root: {
              color: '#fff44f',
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            root: {
              color: '#fff44f',
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              color: '#fff44f',
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            select: {
              color: '#fff44f',
            },
            icon: {
              color: '#fff44f',
            },
            nativeInput: {
              color: '#fff44f',
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              color: '#fff44f',
            },
          },
        },
        MuiFormControlLabel: {
          styleOverrides: {
            label: {
              color: '#fff44f',
            },
          },
        },
      },
    },
  },
  reactJKPlayerTheme: {
    sliderColor: '#fff44f',
  },
  maintainer: 'lovegaoshi@github',
  maintainerTooltip: '关注生草精灵诺莺Nox直播间282208',
  maintinerURL: 'https://live.bilibili.com/282208',
};
