import NoxTheme from './nox';
import skinTemplate, { randomChoice } from './template';
import APMSkins from './APMSkins';

const { gifs } = APMSkins['阿梅播放器']!;
export default () =>
  skinTemplate({
    playerBanner:
      'https://raw.githubusercontent.com/lovegaoshi/azusa-player/nox-player/public/img/Amelia/AmeliaBanner.png',
    playerBannerMobile: async () =>
      'https://steamuserimages-a.akamaihd.net/ugc/1652223957177225502/6F39E40090B7202E4DD4D58876D58E233C5BBC4E/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',

    // playerBackground: async () => new Promise<string>((resolve) => { resolve('https://cdn.donmai.us/original/f5/cd/__watson_amelia_bubba_and_smol_ame_hololive_and_1_more_drawn_by_ro_g_oowack__f5cd65a11ff91b10f52aba05f46aa5e0.jpg'); }),
    playerBackground: async () =>
      'https://rare-gallery.com/livewalls/imgpreview/143356-gawr-gura-and-amelia-watson-vibing-near-a-campfire.mp4',

    playerBackgroundVideo: true,
    gifs,
    gifIcon: () => randomChoice(gifs) as string,
    appTitle: 'Amelia-player',
    colorTheme: NoxTheme().colorTheme,
    reactJKPlayerTheme: NoxTheme().reactJKPlayerTheme,
    maintainer: NoxTheme().maintainer,
    maintainerTooltip: '华生，你发现了盲点',
  });
