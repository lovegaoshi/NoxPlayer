import AzusaTheme from './azusa';
import skinTemplate, { randomChoice } from './template';

const gifs = [
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/spin.gif?raw=true',
  // 'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/cake2.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/shark_rap.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/vacuum.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/fitness_shark.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/taiko_shark.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/a_way_out.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/books.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/boating.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/karaoke.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/rhythm_gaming.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/plug_play.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/supermarket.gif?raw=true',
  'https://i.kym-cdn.com/photos/images/original/002/019/817/d79.gif',
  'https://i.kym-cdn.com/photos/images/original/002/498/345/71b.gif',
  // 'https://i.kym-cdn.com/photos/images/original/002/536/147/6bc.gif',
  // 'https://i.kym-cdn.com/photos/images/original/002/086/857/8e3.gif',
  'https://64.media.tumblr.com/9521b5e88c3205af6f38f98ac98f7668/81dc912cde9331b1-61/s540x810/a78f5e5072a18703dae14d2c929be5de5192be67.gifv',
  'https://64.media.tumblr.com/095318fd7179ebc2ae7630f5f9b43b08/81dc912cde9331b1-7d/s540x810/741e71abc947d54f5879fe9571b0af689a2c883b.gifv',
  'https://64.media.tumblr.com/810c079a61fbc64b04e7e77aa3ed47aa/81dc912cde9331b1-b6/s540x810/3f48fcd826455dda941d9a527f6bfb8b2b286836.gifv',
  'https://64.media.tumblr.com/6579b60f6e46e7f6196a60ebc386fc88/81dc912cde9331b1-25/s540x810/a143adbc5fe899ff53f7e1b870c2c9b365ae5550.gifv',
  'https://64.media.tumblr.com/d3893fc5906f166dfc6b54bcb808f6ba/81dc912cde9331b1-98/s540x810/97f9319f598d427dbab7c6d4db4a623b82e5d66d.gifv',
];
export default skinTemplate({
  playerBanner:
    'https://raw.githubusercontent.com/lovegaoshi/azusa-player/nox-player/public/img/Gura/GuraBanner.png',
  playerBannerMobile: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'https://cdn.donmai.us/sample/00/1f/__gawr_gura_hololive_and_1_more_drawn_by_wellski__sample-001ff8e45cea2114844c7114988d7cff.jpg',
      );
    }),
  playerBackground: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'https://static.moewalls.com/videos/preview/2021/gawr-gura-atlantis-virtual-youtuber-preview.mp4',
      );
    }),
  playerBackgroundVideo: true,
  // 'https://cdn.donmai.us/sample/0d/19/__gawr_gura_and_bloop_hololive_and_1_more_drawn_by_rukako__sample-0d19f403ca5f21106aa2a6cbd1afdb80.jpg',
  // https://cdn.donmai.us/sample/98/69/__gawr_gura_hololive_and_1_more_drawn_by_gueya__sample-98697219522d92d9b39ed6c79d09c456.jpg
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: 'Gura-player',
  colorTheme: {
    generalTheme: 'light',
    // these are adapted from the original azusa player; eventually will be trnaslated into palettes.
    // color for icons such as add to current playlist, on the right panel
    playListIconColor: '#1e90ff',
    songListIconColor: '#1e90ff',
    iconDisableColor: '#adadad',
    // colors for playlist caption on the right panel
    myPlayListCaptionColor: '#1e90ff',
    // similar to above; depreciating?
    playlistCaptionColor: '#1e90ff',
    // color for icons on hte left panel. depreciating?
    songListColumnHeaderColor: 'black',
    // color for icons on hte left panel. depreciating?
    songIconColor: '#1e90ff',
    // colors for song caption on the left panel. depreciating?
    uploaderCaptionColor: '#1e90ff',
    lyricActiveColor: '#c660e7',
    lyricInactiveColor: '#4d388f',
    songListShadowStyle:
      '-4px 5px 6px 2px #1e90ff, 4px -3px 2px 0px #0070ff, 1px 1px 0px 2px #87ceeb',
    lyricImgShadowStyle:
      ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
    PCBackgroundColor: undefined,
    MobileBackgroundColor: 'white',
    FavListBackgroundColor: 'rgba(255,255,255,0.6)',
    FavBackgroundColor: 'rgba(255,255,255,0.9)',
    FavBackgroundColorSolid: 'rgba(255,255,255,1)',
    FavAlternateBackgroundColor: 'rgba(242,242,242,0.5)',
    scrollbarColor: '#1e90ff',
    favMobileBorder: '1px solid #1e90ff',
    clickHoldBackground: 'lightgrey',
    palette: {
      palette: {
        primary: {
          // light: will be calculated from palette.primary.main,
          main: '#1e90ff',
        },
        secondary: {
          // light: will be calculated from palette.primary.main,
          main: '#1e90ff',
        },
      },
      components: {
        MuiListItemButton: {
          styleOverrides: {
            root: {
              color: '#1e90ff ',
            },
          },
        },
      },
    },
  },
  reactJKPlayerTheme: {
    sliderColor: '#1e90ff',
  },
  maintainer: 'lovegaoshi@github',
  maintainerTooltip: 'A',
});
