import { fetchVideoPlayUrl } from '@APM/utils/mediafetch/bilivideo';
import skinTemplate, { randomChoice } from './template';
import APMSkins from './APMSkins';

const { gifs } = APMSkins['安妮播放器']!;

export default () =>
  skinTemplate({
    playerBanner:
      'http://i0.hdslb.com/bfs/space/ac7ed8c017edce6d376707b7ce3a68302edb3c50.png',
    playerBannerMobile: async () =>
      new Promise<string>((resolve) => {
        resolve(
          'https://article.biliimg.com/bfs/article/29af4ddfe6e9a2459b02ccb8181b414080babd65.png',
        );
      }),
    playerBackground: () => fetchVideoPlayUrl('BV1Yv4y1C7K5'),
    playerBackgroundVideo: true,
    // 'http://i0.hdslb.com/bfs/live/room_bg/9ec58de4a73fadb0024ff80db13416093a2b158b.jpg@1920w_1080h.webp',
    gifs,
    gifIcon: () => randomChoice(gifs) as string,
    appTitle: '电妮播放器',
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
    maintainer: '食梦莲lotus@bilibili',
    maintainerTooltip: '关注弃车人的骄傲spiderman安妮直播间27484357',
    maintinerURL: 'https://live.bilibili.com/27484357',
  });
