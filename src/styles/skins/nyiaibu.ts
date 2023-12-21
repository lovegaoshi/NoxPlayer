import skinTemplate from './template';
import clesss from './clesss';
import APMSkins from './APMSkins';

const { gifs, backgroundImagesLandscape } = APMSkins['阿布播放器']!;

export default () =>
  skinTemplate({
    playerBanner:
      'http://192.168.50.1:19527/getimg?imgserve=itsuki&file=niyabu.jpg',
    playerBackground: backgroundImagesLandscape, // BV1Sb4y1i79D
    gifs,
    appTitle: '泽宝播放器',
    colorTheme: clesss().colorTheme,
    reactJKPlayerTheme: clesss().reactJKPlayerTheme,
    maintainer: '黑泽诺亚的五元店@bilibili',
    maintainerTooltip: '',
    maintinerURL: 'https://live.bilibili.com/251015',
  });
