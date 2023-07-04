import NoxTheme from './nox';
import skinTemplate, { randomChoice } from './template';

const gifs = [
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
  'https://i.kym-cdn.com/photos/images/original/002/075/486/1a8.gif',
];
export default skinTemplate({
  playerBanner:
    'https://raw.githubusercontent.com/lovegaoshi/azusa-player/nox-player/public/img/Amelia/AmeliaBanner.png',
  playerBannerMobile: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'https://steamuserimages-a.akamaihd.net/ugc/1652223957177225502/6F39E40090B7202E4DD4D58876D58E233C5BBC4E/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
      );
    }),
  // playerBackground: async () => new Promise<string>((resolve) => { resolve('https://cdn.donmai.us/original/f5/cd/__watson_amelia_bubba_and_smol_ame_hololive_and_1_more_drawn_by_ro_g_oowack__f5cd65a11ff91b10f52aba05f46aa5e0.jpg'); }),
  playerBackground: async () =>
    new Promise<string>((resolve) => {
      resolve(
        'https://rare-gallery.com/livewalls/imgpreview/143356-gawr-gura-and-amelia-watson-vibing-near-a-campfire.mp4',
      );
    }),
  playerBackgroundVideo: true,
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: 'Amelia-player',
  colorTheme: NoxTheme.colorTheme,
  reactJKPlayerTheme: NoxTheme.reactJKPlayerTheme,
  maintainer: NoxTheme.maintainer,
  maintainerTooltip: '华生，你发现了盲点',
});
