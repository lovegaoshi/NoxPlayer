import skinTemplate, { randomChoice } from './template';

const gifs = [
  'https://i0.hdslb.com/bfs/garb/6429e53d4b4c6e42f9cffba4a98e6d98649b3094.png',
  'https://i0.hdslb.com/bfs/garb/f42452eef1eb2af566e5f55878084f4664e16156.png',
  'https://i0.hdslb.com/bfs/garb/5cddcc1b4495e34adf30ae6c2a4fe3cbf09dc5ae.png',
  'https://i0.hdslb.com/bfs/garb/a13546c7289d9d33137b6d880a7254e722b97179.png',
  'https://i0.hdslb.com/bfs/garb/3983331f57302844f457284347077ea34f232b9a.png',
  'https://i0.hdslb.com/bfs/garb/5ec53e041f1f438b3f9202fa59a45b2cdabb34b3.png',
  'https://i0.hdslb.com/bfs/garb/78e1982923e7b34487b59201ec7884a7b7ac896c.png',
  'https://i0.hdslb.com/bfs/garb/ab86e4225db86df2652e82a1e7ec9e31d38a2278.png',
  'https://i0.hdslb.com/bfs/garb/db575b4550e0ae925744b6f0c44787929bc92fa5.png',
  'https://i0.hdslb.com/bfs/garb/e3855b5abec7bf5ab11db1f878f27563dd3fe873.png',
  'https://i0.hdslb.com/bfs/garb/e3ef04b0560af535f97a4115f28f155c0f0202e7.png',
  'https://i0.hdslb.com/bfs/garb/00dd8bd8192bac445c521a211422ef801c4b602d.png',
  'https://i0.hdslb.com/bfs/garb/fd48bb09c1f4383ef9216a3b8b5117be93cbf150.png',
  'https://i0.hdslb.com/bfs/garb/3954a435e7fee2fe06a19f6ba83f669e51e4ca79.png',
  'https://i0.hdslb.com/bfs/garb/f017187b4a5da0e1770dea78689bd8bd160654a4.png',
  'https://i0.hdslb.com/bfs/garb/74cc69b050170126acba84e0fda1620fd235355d.png',
  'https://i0.hdslb.com/bfs/garb/4e98dc6d1abb5a50d51d8c4c4ab380315e1635e5.png',
  'https://i0.hdslb.com/bfs/garb/a5a817d595f87b39e32ebe9b5a75e1071c2280b3.png',
  'https://i0.hdslb.com/bfs/garb/1d313781054a4a22042fc05ef10f95bc09af40a8.png',
  'https://i0.hdslb.com/bfs/garb/8d00f1d169421ef195bcf543e71d13c3e9bb966c.png',
];

const randomPortraitBackground = randomChoice([
  'https://i0.hdslb.com/bfs/garb/f97c35ee849743ee0969f5fca274ecc94d00e638.jpg',
  'https://i0.hdslb.com/bfs/garb/eeec66368c9a92292b6ecda83e39ae4330af7085.jpg',
]) as string;

export default skinTemplate({
  playerBanner:
    'https://i0.hdslb.com/bfs/garb/13a4374fcf3079b009ef1c61eb7cf23ab92560d8.png',
  playerBannerMobile: async () =>
    new Promise<string>((resolve) => {
      resolve(randomPortraitBackground);
    }),
  playerBackgroundMobileVideo: randomPortraitBackground.includes('.mp4'),
  playerBackground: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'https://i0.hdslb.com/bfs/archive/430a3a6e90f342d25ef44ecf2e14b32e6fb71083.jpg',
      );
    }),
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: '小马播放器',
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
  maintainer: '黑泽诺亚的五元店@bilibili',
  maintainerTooltip: '',
  maintinerURL: 'https://live.bilibili.com/251015',
});
