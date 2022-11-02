import StorageManager from '../objects/Storage';
// needs to enable top-level await; necessary for other modules to import current skin config
let setting = await new StorageManager().getPlayerSetting();
export const SkinKeys = [
    '诺莺nox',
    '阿梓azusa',
    '星谷樹itsuki',
];

// default azusa skin.
let defaultSkinPreset = {
    playerBanner:  "https://github.com/kenmingwang/azusa-player/blob/master/public/img/bg3.png?raw=true",
    playerBannerMobile: "",
    gifIcon: () => {
        return "https://github.com/kenmingwang/azusa-player-lrcs/blob/main/aziRandomPic/{count}.gif?raw=true"
        .replace('{count}', Math.floor(Math.random() * 12))
    },
    appTitle: 'Azusa-player',
    colorTheme: {
        // these are adapted from the original azusa player; eventually will be trnaslated into palettes.
        // color for icons such as add to current playlist, on the right panel
        playListIconColor: '#ab5fff',
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
        PCBackgroundColor: 'white',
        FavlistBackgroundColor: 'white',
        FavlistAlternateBackgroundColor: '#f2f2f2',
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
            }
        },
    },
    maintainer: "kenmingwang@github",
};

export const skins = (key = setting.skin) => {

    /**
     * skin requires:
     * player banner (~2000*80)
     * mobile player banner (~600*400)
     * gif icon (60*60)
     * various color themes
     * 
     */
    if (!key) {
        key = '诺莺nox';
    }
    switch (key) {
        case '诺莺nox': 
            return {
                playerBanner: 'https://github.com/lovegaoshi/azusa-player/blob/nox-player/public/img/noxbg.png?raw=true',
                playerBannerMobile: 'https://github.com/lovegaoshi/azusa-player/blob/nox-player/public/img/nox/noxbgm.png?raw=true',
                gifIcon: () => {
                    return "https://github.com/lovegaoshi/azusa-player/blob/nox-player/public/img/noxRandomGIF/nox{count}.gif?raw=true"
                    .replace('{count}', Math.floor(Math.random() * 3))
                },
                appTitle: 'Nox-player',
                colorTheme: {
                    // color for icons such as add to current playlist, on the right panel
                    playListIconColor: '#fff44f',
                    iconDisableColor: '##adadad',
                    // colors for playlist caption on the right panel
                    myPlayListCaptionColor: '#fff44f',
                    // similar to above; depreciating?
                    playlistCaptionColor: '#fff44f',
                    // color for icons on hte left panel. depreciating?
                    songIconColor: '#fff44f',
                    songListColumnHeaderColor: '#fff44f',
                    // colors for song caption on the left panel. depreciating?
                    uploaderCaptionColor: '#fff44f',
                    lyricActiveColor: '#c660e7',
                    lyricInactiveColor: '#4d388f',
                    songListShadowStyle: "-4px 5px 6px 2px #f0e68c, 4px -3px 2px 0px #f0e68c, 1px 1px 0px 2px #fff8dc",
                    lyricImgShadowStyle: " #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px",
                    PCBackgroundColor: '#1E1E1E',
                    FavlistBackgroundColor: '#1E1E1E',
                    FavlistAlternateBackgroundColor: '#3d3d3d',
                    palette: {
                        palette: {
                          primary: {
                            // light: will be calculated from palette.primary.main,
                            main: '#fff44f',
                            // dark: will be calculated from palette.primary.main,
                            // contrastText: will be calculated to contrast with palette.primary.main
                            background: "black",
                          },
                          secondary: {
                            main: '#fff44f',
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
                            MuiPaper: {
                              styleOverrides: {
                                    root: {
                                        backgroundColor: "grey"
                                    }
                              }
                            },
                            MuiDialogTitle: {
                                styleOverrides: {
                                      root: {
                                        color: '#fff44f'
                                      }
                                }
                              },
                            MuiTextField: {
                                styleOverrides: {
                                    root: {
                                        backgroundColor: '#707070',
                                        color: '#fff44f'
                                    },
                                }
                              },
                            MuiIconButton: {
                                styleOverrides: {
                                    root: {
                                        color: '#fff44f',
                                        "&:hover": {
                                            backgroundColor: 'green',
                                        }
                                    }
                                },
                            },
                            MuiListItemButton: {
                                styleOverrides: {
                                    root: {
                                        color: '#fff44f',
                                        "&:hover": {
                                            backgroundColor: 'green',
                                        }
                                    }
                                },
                            },
                            MuiListItemIcon: {
                                styleOverrides: {
                                    root: {
                                        color: '#fff44f'
                                    }
                                }
                            },
                            MuiTablePagination: {
                                styleOverrides: {
                                    root: {
                                        color: '#fff44f'
                                    }
                                }
                            },
                            MuiInput: {
                                styleOverrides: {
                                    root: {
                                        color: '#fff44f'
                                    }
                                }
                            },
                            MuiSelect: {
                                styleOverrides: {
                                    select: {
                                        color: '#fff44f'
                                    },
                                    icon: {
                                        color: '#fff44f'
                                    },
                                    nativeInput: {
                                        color: '#fff44f'
                                    },
                                }
                            },
                            MuiMenuItem: {
                                styleOverrides: {
                                    root: {
                                        color: '#fff44f'
                                    },
                                }
                            },
                          },
                      },
                },
                
                maintainer: 'lovegaoshi@github',
            };
        case '星谷樹itsuki': 
            return {
                playerBanner: 'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=itsukibg.jpg',
                playerBannerMobile: 'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=Itsukibgm.png',
                gifIcon: () => {
                    return "http://150.158.139.227:9527/getimg?imgserve=itsuki&file=ItsukiRandomGIF/Itsuki{count}.gif"
                    .replace('{count}', Math.floor(Math.random() * 2))
                },
                appTitle: 'Itsuki-player',
                colorTheme: defaultSkinPreset.colorTheme,
                maintainer: '树小喵-录播@bilibili',
            };
    }
    // default is azusa skin.
    return defaultSkinPreset;
}

export var skinPreset = skins();