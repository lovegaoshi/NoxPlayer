const gifs = [
  "https://i0.hdslb.com/bfs/article/956a1680d1408517d60e901b63eded873fe1ed5f.gif",
  "https://i0.hdslb.com/bfs/article/b845058b7aaff1f51228c7369b473999ffcb7ee7.gif",
  "https://i0.hdslb.com/bfs/article/bc6b61c2fd818878c1d05da06cb13c5ad425a858.gif",
  "https://i0.hdslb.com/bfs/article/cd25f747b454b9006a25c81d5e7650f73c69ef17.gif",
  "https://i0.hdslb.com/bfs/article/b4afccb0ead8ee044d282cc586c35799a7c888ca.gif",
  "https://i0.hdslb.com/bfs/article/8df79587cda79b6a8e1624715ac5282585769001.gif",
  "https://i0.hdslb.com/bfs/article/a0553b08da8d80dc0f45833ae40146dd88d999a9.gif",
  "https://i0.hdslb.com/bfs/article/9d65d749cacccb307bfcc9a19c88224b0516f106.gif",
  "https://i0.hdslb.com/bfs/article/77c63ef57e4612b5a671d5a417b8513f7285c75e.gif",
  "https://i0.hdslb.com/bfs/article/768acaed9669b76ba1c105030e7a21c1ba15fa91.gif",
  "https://i0.hdslb.com/bfs/article/878b50e28dda6050e78f75d620f05f8a6de6a4c1.gif",
  "https://i0.hdslb.com/bfs/article/28837af291d81ed90500e1cb876769ab9932b91a.gif",
  "https://i0.hdslb.com/bfs/article/c88cc015b4b3e036e1b5689f262f6720b3e0ab97.gif"
];
export const AzusaTheme = {
    playerBanner:  "https://github.com/kenmingwang/azusa-player/blob/master/public/img/bg3.png?raw=true",
    playerBannerMobile: "https://cdn.donmai.us/sample/b8/10/__azusa_nijisanji_and_2_more_drawn_by_bsmycc__sample-b8106d3890e42fc9bfcd896a648a6c80.jpg",
    playerBackground: 'http://i0.hdslb.com/bfs/live/room_bg/36d425e9205e7b0e583580fe44a5b80bb0a70b0d.jpg',
    gifs,
    gifIcon: () => {
        return gifs[Math.floor(Math.random() * gifs.length)>>0]
    },
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
        songListShadowStyle: "-4px 5px 6px 2px #a658f933, 4px -3px 2px 0px #a658f933, 1px 1px 0px 2px #0000001f",
        lyricImgShadowStyle: " #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px",
        PCBackgroundColor: undefined,
        MobileBackgroundColor: 'white',
        FavListBackgroundColor: "rgba(255,255,255,0.6)",
        FavBackgroundColor: "rgba(255,255,255,0.9)",
        FavBackgroundColorSolid: "rgba(255,255,255,1)",
        FavAlternateBackgroundColor: "rgba(242,242,242,0.5)",
        scrollbarColor: '#c6acfc',
        favMobileBorder: "1px solid #ab5fff",
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
                    }
                },
              },
            }
        },
    },
    reactJKPlayerTheme: {
      sliderColor: '#8c98ff',
    },
    maintainer: "kenmingwang@github",
    maintainerTooltip: "",
    maintinerURL: "https://live.bilibili.com/510",
};