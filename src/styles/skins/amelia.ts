import NoxTheme from './nox';
import skinTemplate from './template';
import APMSkins from './APMSkins';

const { gifs, backgroundImagesLandscape } = APMSkins['阿梅播放器']!;
export default () =>
  skinTemplate({
    playerBanner:
      'https://raw.githubusercontent.com/lovegaoshi/azusa-player/nox-player/public/img/Amelia/AmeliaBanner.png',
    playerBackground: backgroundImagesLandscape!,

    gifs,
    appTitle: 'Amelia-player',
    colorTheme: NoxTheme().colorTheme,
    reactJKPlayerTheme: NoxTheme().reactJKPlayerTheme,
    maintainer: NoxTheme().maintainer,
    maintainerTooltip: '华生，你发现了盲点',
  });
