import PomeloTheme from './pomelo';
import skinTemplate from './template';
import APMSkins from './APMSkins';

const { gifs, backgroundImagesLandscape } = APMSkins['塞克西废墟']!;

export default () =>
  skinTemplate({
    playerBanner: PomeloTheme().playerBanner,
    playerBackground: backgroundImagesLandscape,
    gifs,
    appTitle: '电鱼播放器',
    desktopTheme: 'light',
    colorTheme: PomeloTheme().colorTheme,
    reactJKPlayerTheme: PomeloTheme().reactJKPlayerTheme,
    maintainer: '铵溶液制造工厂@bilibili',
    maintainerTooltip: '塞克西开~人人爱~',
  });
