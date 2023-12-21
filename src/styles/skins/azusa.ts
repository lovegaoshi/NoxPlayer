import skinTemplate from './template';
import APMSkins from './APMSkins';

const { gifs, backgroundImagesLandscape } = APMSkins['电梓播放器']!;

export default () =>
  skinTemplate({
    playerBanner:
      'https://github.com/kenmingwang/azusa-player/blob/master/public/img/bg3.png?raw=true',
    playerBackground: backgroundImagesLandscape!, // BV1Sb4y1i79D
    gifs,
    appTitle: 'Azusa-player',
    colorTheme: {
      generalTheme: 'light',
      // these are adapted from the original azusa player; eventually will be trnaslated into palettes.
      // color for icons such as add to current playlist, on the right panel
      playListIconColor: '#ab5fff',
      songListIconColor: '#ab5fff',
      iconDisableColor: '##adadad',
      // colors for playlist caption on the right panel
      myPlayListCaptionColor: '#9600af94',
      // similar to above; depreciating?
      playlistCaptionColor: '#9c55fac9',
      // color for icons on hte left panel. depreciating?
      songListColumnHeaderColor: 'black',
      // color for icons on hte left panel. depreciating?
      songIconColor: '#8e5fab',
      // colors for song caption on the left panel. depreciating?
      uploaderCaptionColor: '#ab5fff',
      lyricActiveColor: '#c660e7',
      lyricInactiveColor: '#4d388f',
      songListShadowStyle:
        '-4px 5px 6px 2px #a658f933, 4px -3px 2px 0px #a658f933, 1px 1px 0px 2px #0000001f',
      lyricImgShadowStyle:
        ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
      PCBackgroundColor: undefined,
      MobileBackgroundColor: 'white',
      FavListBackgroundColor: 'rgba(255,255,255,0.6)',
      FavBackgroundColor: 'rgba(255,255,255,0.9)',
      FavBackgroundColorSolid: 'rgba(255,255,255,1)',
      FavAlternateBackgroundColor: 'rgba(242,242,242,0.5)',
      scrollbarColor: '#c6acfc',
      favMobileBorder: '1px solid #ab5fff',
      clickHoldBackground: 'lightgrey',
      palette: {
        palette: {
          primary: {
            // light: will be calculated from palette.primary.main,
            main: '#ab5fff',
          },
          secondary: {
            // light: will be calculated from palette.primary.main,
            main: '#ce93d8',
          },
        },
        components: {
          MuiListItemButton: {
            styleOverrides: {
              root: {
                color: '#ab5fff',
              },
            },
          },
        },
      },
    },
    reactJKPlayerTheme: {
      sliderColor: '#8c98ff',
    },
    maintainer: 'kenmingwang@github',
    maintainerTooltip: '',
    maintinerURL: 'https://live.bilibili.com/510',
  });
