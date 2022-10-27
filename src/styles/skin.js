import StorageManager from '../objects/Storage';
// needs to enable top-level await; necessary for other modules to import current skin config
let setting = await new StorageManager().getPlayerSetting();
export const SkinKeys = [
    '诺莺nox',
    '阿梓azusa',
    '星谷樹itsuki',
];

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
                    .replace('{count}', Math.floor(Math.random() * 2))
                },
                appTitle: 'Nox-player',
                colorThemes: null,
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
                colorThemes: null,
                maintainer: '树小喵-录播@bilibili',
            };
    }
    // default is azusa skin.
    return {
        playerBanner:  "https://github.com/kenmingwang/azusa-player/blob/master/public/img/bg3.png?raw=true",
        playerBannerMobile: "",
        gifIcon: () => {
            return "https://github.com/kenmingwang/azusa-player-lrcs/blob/main/aziRandomPic/{count}.gif?raw=true"
            .replace('{count}', Math.floor(Math.random() * 12))
        },
        appTitle: 'Azusa-player',
        colorThemes: null,
        maintainer: "kenmingwang@github",
    };
}