import skinTemplate, { randomChoice } from './template';
import clesss from './clesss';
import APMSkins from './APMSkins';

const { gifs, backgroundImagesLandscape } = APMSkins['泽宝播放器']!;

export default () =>
  skinTemplate({
    playerBanner:
      'https://i0.hdslb.com/bfs/garb/item/4d1c96b086ff60d13e3a12d4e514baa028dbec1d.jpg',
    playerBackground: backgroundImagesLandscape,
    // 'https://i0.hdslb.com/bfs/new_dyn/aae8c009d55b9db3472c1059b32cf16c1817527011.jpg'); }),
    gifs,
    gifIcon: () => randomChoice(gifs) as string,
    appTitle: '泽宝播放器',
    colorTheme: clesss().colorTheme,
    reactJKPlayerTheme: clesss().reactJKPlayerTheme,
    maintainer: '黑泽诺亚的五元店@bilibili',
    maintainerTooltip: '',
    maintinerURL: 'https://live.bilibili.com/251015',
  });
