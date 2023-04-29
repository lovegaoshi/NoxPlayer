import skinTemplate, { randomChoice } from './template';

const gifs = [
  'http://i0.hdslb.com/bfs/garb/2dcdd8d6b07907eab66ca12eccf36a5f142b1a18.png',
  'http://i0.hdslb.com/bfs/garb/361b8f691b0e1f68e45dc0feca00ed0198922026.png',
  'http://i0.hdslb.com/bfs/garb/c81fc9e666f1878a5f5c9e8e36ae9a36b4160129.png',
  'http://i0.hdslb.com/bfs/garb/bf4554c8dd336d3f0103028fc70bc893ad12b5ad.png',
  'http://i0.hdslb.com/bfs/garb/1dc357c52f25a6eabc62961a713986cebbe1480a.png',
  'http://i0.hdslb.com/bfs/garb/086dee3bcd491559fe03b93abdbc3690409481de.png',
  'http://i0.hdslb.com/bfs/garb/2507207e54826693b914cee560e3fd5b675f1070.png',
  'http://i0.hdslb.com/bfs/garb/e009b4997bf6d4c1d1bddeacbebdfa33c2ae92e8.png',
  'http://i0.hdslb.com/bfs/garb/51ebafb4f1ffd041b2f59d9b2befe767bc07ff30.png',
  'http://i0.hdslb.com/bfs/garb/4f7b62785137b398bc21e2fdddd11e860e13f53a.png',
  'http://i0.hdslb.com/bfs/garb/7dfb59429238010462ad446e2beee1f013c5db2e.png',
  'http://i0.hdslb.com/bfs/garb/8fb72d0c3d2b2bbf9a9e1d5802da0b6a127ec809.png',
  'http://i0.hdslb.com/bfs/garb/64083b3544423ed40a9f520e14bd8f882692ad08.png',
  'http://i0.hdslb.com/bfs/garb/88495af1ed10b159b0ea3542d21ced22358cabe7.png',
  'http://i0.hdslb.com/bfs/garb/6f5114b31816f679a2cd512bd19c49ea88b82af0.png',
  'http://i0.hdslb.com/bfs/garb/3187e53c85118a6376eec23586430f1daea995d6.png',
  'https://i0.hdslb.com/bfs/article/dda67f2b4e8a3bce161b1981e1d4a394c9063a52.png',
  'https://i0.hdslb.com/bfs/garb/b63c64d0d8669704f77eb6d9a96b108b2d88b235.png',
  'https://i0.hdslb.com/bfs/garb/cadc3a32b0aed12a1e64876be4fab37e71de54a9.png',
  'https://i0.hdslb.com/bfs/garb/a5f3aa73753fe4e4f15273d0033e3b5c7e1687c2.png',
  'https://i0.hdslb.com/bfs/garb/df9675ef0079da53d58e0f335da683c014c67554.png',
  'https://i0.hdslb.com/bfs/garb/29c8e6841aabe6992829c79f2653edd272fe5ccc.png',
  'https://i0.hdslb.com/bfs/garb/1a438559d7349789d6f873ea9cce45df093c5665.png',
  'https://i0.hdslb.com/bfs/garb/a6944acba4fec3ce172b2acacf245faf8fc7a98e.png',
  'https://i0.hdslb.com/bfs/garb/967263546d43368157afdcd30b53f60e0ff50408.png',
  'https://i0.hdslb.com/bfs/garb/0e7d3276929ef1ce7ee0babc2f9d0d921f7bbb77.png',
  'https://i0.hdslb.com/bfs/garb/0ff3313773798a808b231fc466afc6cbe2bc4be6.png',
  'https://i0.hdslb.com/bfs/garb/6889195421eebc5794f97efbb663816cf550c118.png',
  'https://i0.hdslb.com/bfs/garb/7af6ac1edeb33bcb20ce7ba4d6706719cff03804.png',
  'https://i0.hdslb.com/bfs/garb/3f9c72120b04170a46bec19dceda130096127129.png',
  'https://i0.hdslb.com/bfs/garb/0f9bd9d119347679987c3d744bff543c5ea9a8e0.png',
  'https://i0.hdslb.com/bfs/garb/a5e6e73d5a4082211551942b8d7dc99b76ac8d55.png',
  'https://i0.hdslb.com/bfs/garb/6a04c4908df1f7ec2accb867aa45475646e22ae0.png',
  'https://i0.hdslb.com/bfs/garb/1b09bd853c98ab8edd4f5ba6c34616cc59af3ea8.png',
  'https://i0.hdslb.com/bfs/garb/b34d0aa6f96351681a99925a0b8ff7119e632252.png',
  'https://i0.hdslb.com/bfs/garb/44f960042cad6d24406cd5fcbd8225ecb726f702.png',
  'https://i0.hdslb.com/bfs/garb/2f6e8d9626cafcabe9e65b54185b2af687c93472.png',
];
export default skinTemplate({
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
