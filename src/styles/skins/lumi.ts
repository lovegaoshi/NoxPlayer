import { fetchVideoPlayUrl } from '@APM/utils/mediafetch/bilivideo';
import skinTemplate, { randomChoice } from './template';
import APMSkins from './APMSkins';

const { gifs } = APMSkins['露米播放器']!;

const randomPortraitBackground = randomChoice([
  'https://i0.hdslb.com/bfs/garb/54a7d01058c843df9f4fadde99df42a8fb446f60.jpg',
  'https://i0.hdslb.com/bfs/garb/1167eb2420f0480ab506f5d7d9bc18271800e57f.jpg',
  'https://i0.hdslb.com/bfs/garb/54b09bc72cf1537c0ba0f11eb9bc13091b01aad1.jpg',
  'https://i0.hdslb.com/bfs/garb/95874aff3686bee1b0c942658bade9543f8c6302.jpg',
]) as string;

export default () =>
  skinTemplate({
    playerBanner:
      'https://i0.hdslb.com/bfs/article/61a9243034ae538637fec40dcad4bab102b40d5a.png',
    playerBannerMobile: async () => randomPortraitBackground,
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
