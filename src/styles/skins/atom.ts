import skinTemplate, { randomChoice } from './template';

const gifs = [
  'https://i0.hdslb.com/bfs/garb/91f5709e2a54844584c1f3b986cbf78d082b3712.png',
  'https://i0.hdslb.com/bfs/garb/6f2ff2e52306be48f144ba6e8912aba51f5a239d.png',
  'https://i0.hdslb.com/bfs/garb/fa9823893eaa7038cf815626c908622ab53eda6e.png',
  'https://i0.hdslb.com/bfs/garb/a44ebddbb8dbc0633287a6e64542d1dafb537db7.png',
  'https://i0.hdslb.com/bfs/garb/7a7a8e0c82327512c829fab69de72a28be6a566d.png',
  'https://i0.hdslb.com/bfs/garb/ca0f5258d0f51d013645bcec8015656d03768995.png',
  'https://i0.hdslb.com/bfs/garb/2e6348ed5027f900f4907c8a2083f8efd97f7171.png',
  'https://i0.hdslb.com/bfs/garb/8c43402454ba4563466613098c557b10258e8a08.png',
  'https://i0.hdslb.com/bfs/garb/dff8b7374a3f12b0bab04899562ed161cacb78f2.png',
  'https://i0.hdslb.com/bfs/garb/72be33e9db0c6502d81b1f26d7beb12b04783674.png',
  'https://i0.hdslb.com/bfs/garb/ae9928548b2f0b069ec864dc1d570bebf01b55b6.png',
  'https://i0.hdslb.com/bfs/garb/dee6d892706fc1fcab6e48797cfc208eb6fe4f87.png',
  'https://i0.hdslb.com/bfs/garb/7ebc2c1b5e14d87477e2290a558f55853753fea5.png',
  'https://i0.hdslb.com/bfs/garb/c14dad9611b11cd3bcd2bd83ac1457996863c9e0.png',
  'https://i0.hdslb.com/bfs/garb/8cd5e19684b78b005e948c540a109a6adc6b9ee1.png',
  'https://i0.hdslb.com/bfs/garb/4646908b1ed68798bef21cde31a0482ed7516d43.png',
  'https://i0.hdslb.com/bfs/garb/c1a73d2ec873cd6577f88ba864c8c896ec0b4e58.png',
  'https://i0.hdslb.com/bfs/garb/7a95b2bc7492bce288436617ec1c01b32506e7e5.png',
  'https://i0.hdslb.com/bfs/garb/ae9bd7b93ae69c54081e12cccb1fa508a3241d8d.png',
  'https://i0.hdslb.com/bfs/garb/56d914896b5d8470354b5587bbcf25129d63c70c.png',
  'https://i0.hdslb.com/bfs/garb/9c0a0bd8537a7adfa93a7e1d73fe76e128dfe296.png',
  'https://i0.hdslb.com/bfs/garb/b9bb10996653e1d3579377bdf3cf64386ba946c3.png',
  'https://i0.hdslb.com/bfs/garb/01a2de3680b6b6a23ab3e0fe19f3e3a2b3859d3c.png',
  'https://i0.hdslb.com/bfs/garb/04256613e962fd97da5f0d392d87222835b2015b.png',
  'https://i0.hdslb.com/bfs/garb/9caf823d27a686dbf2b8a720842d7ad1bb223f11.png',
];

export default skinTemplate({
  playerBanner:
    'https://i0.hdslb.com/bfs/new_dyn/a6055de12310f55ac6590a86bd4008365053504.png',
  playerBannerMobile: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'https://cdn.donmai.us/original/ea/ec/__nox_nijisanji_and_3_more_drawn_by_netural__eaec50f6d554b731ffe4fcace255d0bd.png',
      );
    }),
  playerBackground: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'http://i0.hdslb.com/bfs/live/room_bg/1428a93e4a983a7a6e7ba3dc62b064e403fc8354.png',
      );
    }),
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
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
    songListShadowStyle:
      '-4px 5px 6px 2px #f0e68c, 4px -3px 2px 0px #f0e68c, 1px 1px 0px 2px #fff8dc',
    lyricImgShadowStyle:
      ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
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
});
