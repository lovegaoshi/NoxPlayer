
import { AzusaTheme } from './azusa';
const gifs = [
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/roki.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/recorder.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/calliop3.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/interrupted_by_bird.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/toilet_rap.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/drinking_party.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/cantaloupe.gif?raw=true',
];  
export const CaliTheme = {
    playerBanner: 'https://raw.githubusercontent.com/lovegaoshi/azusa-player/nox-player/public/img/Gura/GuraBanner.png',
    playerBannerMobile: 'https://cdn.donmai.us/sample/00/1f/__gawr_gura_hololive_and_1_more_drawn_by_wellski__sample-001ff8e45cea2114844c7114988d7cff.jpg', 
    //'https://cdn.donmai.us/sample/0d/19/__gawr_gura_and_bloop_hololive_and_1_more_drawn_by_rukako__sample-0d19f403ca5f21106aa2a6cbd1afdb80.jpg',
    // https://cdn.donmai.us/sample/98/69/__gawr_gura_hololive_and_1_more_drawn_by_gueya__sample-98697219522d92d9b39ed6c79d09c456.jpg
    gifs,
    gifIcon: () => {      
        return gifs[Math.floor(Math.random() * gifs.length)>>0]
    },
    appTitle: 'Gura-player',
    colorTheme: {
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
        songListShadowStyle: "-4px 5px 6px 2px #1e90ff, 4px -3px 2px 0px #0070ff, 1px 1px 0px 2px #87ceeb",
        lyricImgShadowStyle: " #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px",
        PCBackgroundColor: 'white',
        FavlistBackgroundColor: 'white',
        FavlistAlternateBackgroundColor: '#f2f2f2',
        scrollbarColor: '#1e90ff',
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
                    }
                },
              },
            }
        },
    },
    reactJKPlayerTheme: {
      sliderColor: '#1e90ff',
    },
    maintainer: 'lovegaoshi@github',
    maintainerTooltip: "A",
};