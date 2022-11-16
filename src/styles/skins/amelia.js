
import { NoxTheme } from './nox';

export const AmeliaTheme = {
    playerBanner: 'https://raw.githubusercontent.com/lovegaoshi/azusa-player/nox-player/public/img/Amelia/AmeliaBanner.png',
    playerBannerMobile: 'https://cdn.donmai.us/sample/11/ac/__watson_amelia_hololive_and_1_more_drawn_by_oozora_halu__sample-11acdfd9e23432d93d241c4942d2047f.jpg',
    gifIcon: () => {
        let gifs = [
            'https://walfiegif.files.wordpress.com/2022/03/out-transparent.gif',
            'https://walfiegif.files.wordpress.com/2022/01/out-transparent-2.gif',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/ameJAM.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/popcorn.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/fast.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/party.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/celebration.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/bee.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/example.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/tap_tap.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/cake.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/cooking_simulator.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/bongo.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/camera.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/portal.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/crunchy_marshmallow.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/ukulele_practice.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/reading.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/ground_pound.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/driving.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/rolling.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/she_appears.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/delicious_tears.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/controller_smash.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/this_is_true.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/wide.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/minecraft_rap.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/gold_mining.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/spicy_noodles.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/sand.gif?raw=true',
        ];        
        return gifs[Math.floor(Math.random() * gifs.length)>>0]
    },
    appTitle: 'Amelia-player',
    colorTheme: NoxTheme.colorTheme,
    reactJKPlayerTheme: NoxTheme.reactJKPlayerTheme,
    maintainer: NoxTheme.maintainer,
    maintainerTooltip: "",
};