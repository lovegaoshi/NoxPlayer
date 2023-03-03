const gifs = [
    "http://i0.hdslb.com/bfs/garb/bbb6a1eb1e5d8ce5e6b3874852b66e92b1563ec6.png",
    "http://i0.hdslb.com/bfs/garb/217153560d4a507dccb2b18df67aa60cace10ad9.png",
    "http://i0.hdslb.com/bfs/garb/ea39646fee8b4b226ccc9555f6b61ebb2da107b8.png",
    "http://i0.hdslb.com/bfs/garb/69ab6e9df94b15819fa1d4c4d88596bf0cec0bf2.png",
    "http://i0.hdslb.com/bfs/garb/05b4eae551b81e3804e0611fb543829d240686d4.png",
    "http://i0.hdslb.com/bfs/garb/f25882b99a24db75f37269e2099b3b42d576cf23.png",
    "http://i0.hdslb.com/bfs/garb/4c5f1dcbcb220b96703126ef1c95e3873a050e98.png",
    "http://i0.hdslb.com/bfs/garb/c3d491742e90f69ef3eeab36fc5b51d9e6da3ce0.png",
    "http://i0.hdslb.com/bfs/garb/2b3f267c9ea8006a2b6f87a5f1bf82e47ef36241.png",
    "http://i0.hdslb.com/bfs/garb/4b44860cf1d6e78b2654bed0fc98eb23081036dd.png",
    "http://i0.hdslb.com/bfs/garb/709f1e449d7bf58ef405d6af5ee2e60ea3cb8304.png",
    "http://i0.hdslb.com/bfs/garb/3a68bac353defa508354134da3840454c3b5c89d.png",
    "http://i0.hdslb.com/bfs/garb/df0bc269ac1536e97c14045fac05cb945c2ea741.png",
    "http://i0.hdslb.com/bfs/garb/b43e7969d73729a61e0a44b8e4c76f8b7b8a9678.png",
    "http://i0.hdslb.com/bfs/garb/69aecdf188ff54bb20e5d3668b4464d0d731776f.png",
    "http://i0.hdslb.com/bfs/live/58f2c407127231d3afced5c88fc75be57194ec30.png",
    "http://i0.hdslb.com/bfs/live/a1dfb92751ece5822ebb1e49b332b3599d86b4bf.png",
    "http://i0.hdslb.com/bfs/live/2bb2c67c03e9a02444133db6ca6fce57b3a90d34.png",
    "http://i0.hdslb.com/bfs/live/1c42e5c82ca70edbea10f9f8e9222dd46e656aa6.png",
    "http://i0.hdslb.com/bfs/live/c80dbeece0214d802e8d44f48285bf43de2ffb68.png",
    "http://i0.hdslb.com/bfs/live/61aeadbaef10e1d3f89c6be174a901ebd41c6939.png",
    "http://i0.hdslb.com/bfs/live/32bc13100659019fcb98c272277ad5b285804d3c.png",
    "http://i0.hdslb.com/bfs/live/7f66eebd007f52ceb63caf78ee4feb6af01914c7.png",
    "http://i0.hdslb.com/bfs/live/80e69b9a99accf247bb2621779d73b9c19b4ef26.png",
    "http://i0.hdslb.com/bfs/live/12941f62e9b58c4fbd48442bb1f09feecdd816af.png",
];    

export const HeraKrisTheme = {
    playerBanner: 'https://article.biliimg.com/bfs/article/9c49d0133498d844869438569cf36d96ffe56234.png',
    playerBannerMobile: 'https://article.biliimg.com/bfs/article/665f1975a070f013580832fef95621aef37a1b2c.png',
    playerBackground: 'http://i0.hdslb.com/bfs/live/room_bg/f969cfa685038d4d8210c9aa2844677bc5a58eeb.jpg',
    gifs,
    gifIcon: () => {
        return gifs[Math.floor(Math.random() * gifs.length)>>0]
        return "https://github.com/lovegaoshi/azusa-player/blob/nox-player/public/img/noxRandomGIF/nox{count}.gif?raw=true"
        .replace('{count}', Math.floor(Math.random() * 3))
    },
    appTitle: 'HeraKris-player',
    colorTheme: {
        generalTheme: 'dark',
        // color for icons such as add to current playlist, on the right panel
        playListIconColor: '#90ee90',
        songListIconColor: '#90ee90',
        iconDisableColor: '##adadad',
        // colors for playlist caption on the right panel
        myPlayListCaptionColor: '#90ee90',
        // similar to above; depreciating?
        playlistCaptionColor: '#90ee90',
        // color for icons on hte left panel. depreciating?
        songIconColor: '#90ee90',
        songListColumnHeaderColor: '#90ee90',
        // colors for song caption on the left panel. depreciating?
        uploaderCaptionColor: '#90ee90',
        lyricActiveColor: '#c660e7',
        lyricInactiveColor: '#4d388f',
        songListShadowStyle: "-4px 5px 6px 2px #90ee90, 4px -3px 2px 0px #90ee90, 1px 1px 0px 2px #00ff7f",
        lyricImgShadowStyle: " #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px",
        PCBackgroundColor: 'rgba(30,30,30,0.85)',
        MobileBackgroundColor: '#1E1E1E',
        FavBackgroundColor: "rgba(30,30,30,0.5)",
        FavBackgroundColorSolid: "rgba(30,30,30,1)",
        FavAlternateBackgroundColor: "rgba(61,61,61,0.5)",
        scrollbarColor: '#90ee90',
        favMobileBorder: "1px solid white",
        clickHoldBackground: '#6F116F',
        palette: {
            palette: {
              primary: {
                // light: will be calculated from palette.primary.main,
                main: '#90ee90',
                // dark: will be calculated from palette.primary.main,
                // contrastText: will be calculated to contrast with palette.primary.main
                background: "black",
              },
              secondary: {
                main: '#90ee90',
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
              background: {
                default: "#000000"
              }
            },
            components: {
                MuiTooltip: {
                    styleOverrides: {
                        tooltip: {
                            fontSize: "1.4em",
                        },
                    }
                },
                MuiPaper: {
                  styleOverrides: {
                        root: {
                            backgroundColor: "#1E1E1E",
                            color: '#90ee90'
                        }
                  }
                },
                MuiDialogTitle: {
                    styleOverrides: {
                          root: {
                            color: '#90ee90'
                          }
                    }
                  },
                MuiDialogContentText: {
                    styleOverrides: {
                        root: {
                            color: '#90ee90'
                        }
                    }
                },
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#1E1E1E',
                            color: '#90ee90'
                        },
                    }
                  },
                MuiInputLabel: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#1E1E1E',
                            color: '#90ee90'
                        },
                    }
                },
                MuiOutlinedInput: {
                    styleOverrides: {
                        root: {
                            color: '#90ee90'
                        },
                        input: {
                            color: '#90ee90'
                        },
                    }
                },
                MuiInputBase: {
                    styleOverrides: {
                        input: {
                            color: '#90ee90',
                        },
                    }
                },
                MuiIconButton: {
                    styleOverrides: {
                        root: {
                            color: '#90ee90',
                            "&:hover": {
                                backgroundColor: '#6F116F',
                            }
                        }
                    },
                },
                MuiListItemButton: {
                    styleOverrides: {
                        root: {
                            color: '#90ee90',
                            "&:hover": {
                                backgroundColor: '#6F116F',
                            }
                        }
                    },
                },
                MuiListItemIcon: {
                    styleOverrides: {
                        root: {
                            color: '#90ee90'
                        }
                    }
                },
                MuiTablePagination: {
                    styleOverrides: {
                        root: {
                            color: '#90ee90'
                        }
                    }
                },
                MuiInput: {
                    styleOverrides: {
                        root: {
                            color: '#90ee90'
                        }
                    }
                },
                MuiSelect: {
                    styleOverrides: {
                        select: {
                            color: '#90ee90'
                        },
                        icon: {
                            color: '#90ee90'
                        },
                        nativeInput: {
                            color: '#90ee90'
                        },
                    }
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            color: '#90ee90'
                        },
                    }
                },
                MuiFormControlLabel: {
                    styleOverrides: {
                        label: {
                            color: '#90ee90'
                        },
                    },
                },
              },
          },
    },
    reactJKPlayerTheme: {
        sliderColor: '#90ee90',
    },
    maintainer: '-哆啦A林-@bilibili',
    maintainerTooltip: '给你一拳',
};