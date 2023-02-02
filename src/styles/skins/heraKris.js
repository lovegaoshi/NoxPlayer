const gifs = [
    'https://i0.hdslb.com/bfs/new_dyn/697096d892a7193d33dbdc0edc5e2c9f5053504.gif',
    'https://i0.hdslb.com/bfs/new_dyn/d9f4d8ea6686304cefff9ce096f0f4135053504.gif',
    'https://i0.hdslb.com/bfs/new_dyn/2e678361788e9fd518fb47bc5ab15e8b5053504.gif',
    'https://i0.hdslb.com/bfs/new_dyn/26bcb47c59fb3d004bf0b93f6749da6f5053504.gif',
    'https://article.biliimg.com/bfs/article/2841b7662c4d6a32c3852f58b623e234f7f4e21a.gif',
    'http://article.biliimg.com/bfs/article/0290281b9aa9d28c522dfd8be3de4e0527eb7b2f.gif',
];    

export const HeraKrisTheme = {
    playerBanner: 'http://192.168.50.1:19527/getimg?imgserve=itsuki&file=herabanner.png',
    playerBannerMobile: 'http://192.168.50.1:19527/getimg?imgserve=itsuki&file=heraportrait.png',
    playerBackground: 'http://i0.hdslb.com/bfs/live/room_bg/f969cfa685038d4d8210c9aa2844677bc5a58eeb.jpg',
    gifs,
    gifIcon: () => {
        return gifs[Math.floor(Math.random() * gifs.length)>>0]
        return "https://github.com/lovegaoshi/azusa-player/blob/nox-player/public/img/noxRandomGIF/nox{count}.gif?raw=true"
        .replace('{count}', Math.floor(Math.random() * 3))
    },
    appTitle: 'HeraKris-player',
    colorTheme: {
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
        songListShadowStyle: "-4px 5px 6px 2px #f0e68c, 4px -3px 2px 0px #f0e68c, 1px 1px 0px 2px #fff8dc",
        lyricImgShadowStyle: " #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px",
        PCBackgroundColor: '#1E1E1E',
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