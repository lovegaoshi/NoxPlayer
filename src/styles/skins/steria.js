// this is a pink/light theme.

const gifs = [
    "http://i0.hdslb.com/bfs/garb/9d035f81ecbb9d2cb5f8965eb939f6edadd1ad5f.png",
    "http://i0.hdslb.com/bfs/garb/225e977d9e9970aa2626c8dc953022496abb6cf2.png",
    "http://i0.hdslb.com/bfs/garb/8530e80244907c106cd78bf33eaefb49766da6af.png",
    "http://i0.hdslb.com/bfs/garb/6419ffdc524f9594d4a5880c795e331fb33e8c4d.png",
    "http://i0.hdslb.com/bfs/garb/96919cc30c25c3f9d8f1f4536b09cb08d047a609.png",
    "http://i0.hdslb.com/bfs/garb/71de7c29e8c2d7879da363409829c8ff82f9aa72.png",
    "http://i0.hdslb.com/bfs/garb/eb0be385d49dbb63e1f19619922051d0eb01fa6c.png",
    "http://i0.hdslb.com/bfs/garb/0e0017f8767e110105caf12ed47baee1df15089a.png",
    "http://i0.hdslb.com/bfs/garb/3156c1688298cd9e9a8bce75ea7c71fbbef96789.png",
    "http://i0.hdslb.com/bfs/garb/d868a9e10895eef1f565746a727e8286319f8d7a.png",
    "http://i0.hdslb.com/bfs/garb/705197bcb5cb3e652e3955749401d8d48ac7997a.png",
    "http://i0.hdslb.com/bfs/garb/1c0434eb2bc03ef4dc6d91b07e0778046e7634ab.png",
    "http://i0.hdslb.com/bfs/garb/085461dd431e1c42958959332edd016d4325e292.png",
    "http://i0.hdslb.com/bfs/garb/a2c1b730905a876ba0cdcf42c12b674b90b86038.png",
    "http://i0.hdslb.com/bfs/garb/001887ba703fd72a87d4ab3b99cb3d6c0ecfb154.png",
];

export default SteriaTheme = {
    playerBanner:  "https://article.biliimg.com/bfs/article/41ead2cf9db8946f335d4d66cc9044dc8b961aa4.png",
    playerBannerMobile: "https://article.biliimg.com/bfs/article/29af4ddfe6e9a2459b02ccb8181b414080babd65.png",
    playerBackground: 'http://i0.hdslb.com/bfs/live/room_bg/9ec58de4a73fadb0024ff80db13416093a2b158b.jpg@1920w_1080h.webp',
    gifs,
    gifIcon: () => {
        return gifs[Math.floor(Math.random() * gifs.length)>>0]

        return "https://github.com/kenmingwang/azusa-player-lrcs/blob/main/aziRandomPic/{count}.gif?raw=true"
        .replace('{count}', Math.floor(Math.random() * 12))
    },
    appTitle: '电姨播放器',
    desktopTheme: 'light',
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
        songListShadowStyle: "-4px 5px 6px 2px #ffc1cc, 4px -3px 2px 0px #ffc1cc, 1px 1px 0px 2px #ffcff1",
        lyricImgShadowStyle: " #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px",
        PCBackgroundColor: undefined,
        MobileBackgroundColor: 'white',
        FavBackgroundColor: "rgba(255,255,255,0.9)",
        FavBackgroundColorSolid: "rgba(255,255,255,1)",
        FavAlternateBackgroundColor: "rgba(242,242,242,0.5)",
        scrollbarColor: '#ffbcd9',
        favMobileBorder: "1px solid #ff1493",
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
                          fontSize: "1.4em",
                      },
                  }
              },
              MuiListItemButton: {
                styleOverrides: {
                    root: {
                        color: '#ff1493',
                        "&:hover": {
                            backgroundColor: "rgba(255,188,217,0.6)",
                        },
                    }
                },
              },
              MuiOutlinedInput: {
                  styleOverrides: {
                      root: {
                          color: '#ff1493'
                      },
                      input: {
                          color: '#ff1493'
                      },
                  }
              },
              MuiFormControlLabel: {
                  styleOverrides: {
                      label: {
                          color: '#ff1493'
                      },
                      root: {
                          color: '#ff1493'
                      },
                  }
              },
              MuiTextField: {
                  styleOverrides: {
                      root: {
                          color: '#ff1493'
                      },
                  }
                },
            }
        },
    },
    reactJKPlayerTheme: {
      sliderColor: '#ffbcd9',
    },
    maintainer: "薇薇單推人@bilibili",
    maintainerTooltip: "关注弃车人的骄傲spiderman安妮直播间438068",
};