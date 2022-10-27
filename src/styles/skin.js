export const skins = (key) => {

    /**
     * skin requires:
     * player banner (~2000*80)
     * mobile player banner (~600*400)
     * gif icon (60*60)
     * various color themes
     * 
     */
    switch (key) {
        case 'nox': 
        return {
            playerBanner:  'https://github.com/lovegaoshi/azusa-player/blob/nox-player/public/img/nox/noxbgm.png?raw=true',
            playerBannerMobile: 'https://github.com/lovegaoshi/azusa-player/blob/nox-player/public/img/noxbg.png?raw=true',
            gifIcon: () => {
                return "https://github.com/lovegaoshi/azusa-player/blob/nox-player/public/img/noxRandomGIF/nox{count}.gif?raw=true"
                .replace('{count}', Math.floor(Math.random() * 2))
            },
            colorThemes: null,
            maintainer: 'lovegaoshi@github'
        }
    }

    return {
        playerBanner:  null,
        playerBannerMobile: null,
        gifIcon: null,
        colorThemes: null,
        maintainer: null
    }
}