import { fetchVideoPlayUrl } from '@APM/utils/mediafetch/bilivideo';
import skinTemplate, { randomChoice } from './template';
// this is a pink/light theme.

const gifs = [
  'https://i0.hdslb.com/bfs/garb/37ca0e7d448757b70ac27b780ed6f5a1d4aef419.png',
  'https://i0.hdslb.com/bfs/garb/9a5e3d32ce0e468c58c2ea18f13fd138e8d4363e.png',
  'https://i0.hdslb.com/bfs/garb/fa37cb2b4d35eed33f55902401d014279dcec80d.png',
  'https://i0.hdslb.com/bfs/garb/c85b756af9f8ca2f75b7d1f1c0d51334f344a306.png',
  'https://i0.hdslb.com/bfs/garb/a441615d16be1d8ac9a944e95dd4317f81e1e065.png',
  'https://i0.hdslb.com/bfs/garb/f29ba91740ab3b1285432326600796e57019dd11.png',
  'https://i0.hdslb.com/bfs/garb/33a6f1f66530d01327596c3db2b4ce9ef40db20a.png',
  'https://i0.hdslb.com/bfs/garb/df1bbc9ecd79b20cf1aae69241827918c3f81209.png',
  'https://i0.hdslb.com/bfs/garb/c2e39cb4c3c41fd9e8f0665ef32c43ee3a454cc2.png',
  'https://i0.hdslb.com/bfs/garb/385f94ff406d639c404784b7909a74f1cef3d2bf.png',
  'https://i0.hdslb.com/bfs/garb/07256389f945f9f71c83947dedb2e2810da14fc9.png',
  'https://i0.hdslb.com/bfs/garb/86b1207a44c8173f273965d01ed425073b46a3e4.png',
  'https://i0.hdslb.com/bfs/garb/4fb644d1e7fef0a6cacb791b89028a02ff846595.png',
  'https://i0.hdslb.com/bfs/garb/9408b758b893d5ca1d5deee72a0b4c90c2281847.png',
  'https://i0.hdslb.com/bfs/garb/9a98f9a4bc56fb1157e14fa707e08804659b3aa7.png',
  'https://i0.hdslb.com/bfs/garb/55beac46023b47efbc2058afcf039e07f507817c.png',
  'https://i0.hdslb.com/bfs/garb/fefa52b2812f943b20eb9e30252daba142aa2f8b.png',
  'https://i0.hdslb.com/bfs/garb/2340a41a5970a6e8149f0212fe75afaf58bc716d.png',
  'https://i0.hdslb.com/bfs/garb/2599a1941d372bd375535f2e3db69a7b6a904a69.png',
  'https://i0.hdslb.com/bfs/garb/e92b54556ffd13c9bd2b4cc082d83598742603e1.png',
  'https://i0.hdslb.com/bfs/garb/9359b877e4742d5c21cc8cc8da00270301294c39.png',
  'https://i0.hdslb.com/bfs/garb/4e328d21fa6f4918f25beac83cd8ca16d6efa766.png',
  'https://i0.hdslb.com/bfs/garb/2e04362b13997a1581d1081d58d4fe64b6d9bcb8.png',
  'https://i0.hdslb.com/bfs/garb/84639cd34983cf12bea14b6099425caffd52adb3.png',
  'https://i0.hdslb.com/bfs/garb/914da96a2ddb6c4452950b4179076eb1a7bbd0dd.png',
  'https://i0.hdslb.com/bfs/garb/e679180974b6e35ffccfc5b0ceefdeaeab40958f.png',
  'https://i0.hdslb.com/bfs/garb/4f473e417781bcdbc84fb2737f7fff198adf59cd.png',
  'https://i0.hdslb.com/bfs/garb/af560e53b50c9fc52c2fb171efea7e63ebcac9a0.png',
  'https://i0.hdslb.com/bfs/garb/c1c28ac1d87be6df55057f4873db607357f7fc3c.png',
  'https://i0.hdslb.com/bfs/garb/e463f4b68b85c5983508d758143fa3d4f12d9233.png',
  'https://i0.hdslb.com/bfs/garb/22f7c77b91770ce0a6a786d9fcd0a3317442c666.png',
  'https://i0.hdslb.com/bfs/garb/062f3393acfa7281e664793c4d86cd7ae4d5f4f5.png',
  'https://i0.hdslb.com/bfs/garb/d5a59d8f12f76afe565389703b6e239e6721bb5d.png',
  'https://i0.hdslb.com/bfs/garb/b2076680a8b5705575a747ce01086b14c997065c.png',
  'https://i0.hdslb.com/bfs/live/d5a59d8f12f76afe565389703b6e239e6721bb5d.png',
  'https://i0.hdslb.com/bfs/live/e463f4b68b85c5983508d758143fa3d4f12d9233.png',
  'https://i0.hdslb.com/bfs/live/4f473e417781bcdbc84fb2737f7fff198adf59cd.png',
  'https://i0.hdslb.com/bfs/live/af560e53b50c9fc52c2fb171efea7e63ebcac9a0.png',
  'https://i0.hdslb.com/bfs/live/e679180974b6e35ffccfc5b0ceefdeaeab40958f.png',
  'https://i0.hdslb.com/bfs/live/22f7c77b91770ce0a6a786d9fcd0a3317442c666.png',
  'https://i0.hdslb.com/bfs/live/062f3393acfa7281e664793c4d86cd7ae4d5f4f5.png',
  'https://i0.hdslb.com/bfs/live/b2076680a8b5705575a747ce01086b14c997065c.png',
  'https://i0.hdslb.com/bfs/live/7f99b007a74567de7777c4ab3e09ef1f16419e24.png',
  'https://i0.hdslb.com/bfs/live/c1c28ac1d87be6df55057f4873db607357f7fc3c.png',
  'https://i0.hdslb.com/bfs/article/ce29d6ca43cedd4074c9065fb05af54c53c9c6c0.gif',
];

const randomPortraitBackground = randomChoice([
  'https://i0.hdslb.com/bfs/garb/54a7d01058c843df9f4fadde99df42a8fb446f60.jpg',
  'https://i0.hdslb.com/bfs/garb/1167eb2420f0480ab506f5d7d9bc18271800e57f.jpg',
  'https://i0.hdslb.com/bfs/garb/54b09bc72cf1537c0ba0f11eb9bc13091b01aad1.jpg',
  'https://i0.hdslb.com/bfs/garb/95874aff3686bee1b0c942658bade9543f8c6302.jpg',
]) as string;

export default skinTemplate({
  playerBanner:
    'https://i0.hdslb.com/bfs/article/61a9243034ae538637fec40dcad4bab102b40d5a.png',
  playerBannerMobile: async () =>
    new Promise<string>((resolve) => {
      resolve(randomPortraitBackground);
    }),
  playerBackground: () => fetchVideoPlayUrl('BV1nj411X7Vr'),
  playerBackgroundVideo: true,
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: '露米播放器',
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
    sliderColor: '#ffbcd9',
  },
  maintainer: '熹熹里周报@bilibili',
  maintainerTooltip: '关注星云少女露米Lumi_Official',
  maintinerURL: 'https://live.bilibili.com/25977291',
});
