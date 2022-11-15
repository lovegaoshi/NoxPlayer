
import { AzusaTheme } from './azusa';

export const ItsukiTheme = {
    playerBanner: 'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=itsukibg.jpg',
    playerBannerMobile: 'http://150.158.139.227:9527/getimg?imgserve=itsuki&file=Itsukibgm.png',
    gifIcon: () => {
        return "http://150.158.139.227:9527/getimg?imgserve=itsuki&file=ItsukiRandomGIF/Itsuki{count}.gif"
        .replace('{count}', Math.floor(Math.random() * 2))
    },
    appTitle: 'Itsuki-player',
    colorTheme: AzusaTheme.colorTheme,
    reactJKPlayerTheme: AzusaTheme.reactJKPlayerTheme,
    maintainer: '树小喵-录播@bilibili',
    maintainerTooltip: "",
};