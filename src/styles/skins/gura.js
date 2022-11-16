
import { AzusaTheme } from './azusa';

export const GuraTheme = {
    playerBanner: 'https://i0.hdslb.com/bfs/new_dyn/a6055de12310f55ac6590a86bd4008365053504.png',
    playerBannerMobile: 'https://cdn.donmai.us/sample/00/1f/__gawr_gura_hololive_and_1_more_drawn_by_wellski__sample-001ff8e45cea2114844c7114988d7cff.jpg', 
    //'https://cdn.donmai.us/sample/0d/19/__gawr_gura_and_bloop_hololive_and_1_more_drawn_by_rukako__sample-0d19f403ca5f21106aa2a6cbd1afdb80.jpg',
    // https://cdn.donmai.us/sample/98/69/__gawr_gura_hololive_and_1_more_drawn_by_gueya__sample-98697219522d92d9b39ed6c79d09c456.jpg
    gifIcon: () => {
        let gifs = [
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/spin.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/cake2.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/shark_rap.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/vacuum.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/fitness_shark.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/taiko_shark.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/a_way_out.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/books.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/boating.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/karaoke.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/rhythm_gaming.gif?raw=true',
            'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/plug_play.gif?raw=true',
        ];        
        return gifs[Math.floor(Math.random() * gifs.length)>>0]
    },
    appTitle: 'Gura-player',
    colorTheme: AzusaTheme.colorTheme,
    reactJKPlayerTheme: AzusaTheme.reactJKPlayerTheme,
    maintainer: 'lovegaoshi@github',
    maintainerTooltip: "",
};