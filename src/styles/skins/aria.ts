import { fetchVideoPlayUrl } from '@APM/utils/mediafetch/bilivideo';
import PomeloTheme from './pomelo';
import skinTemplate, { randomChoice } from './template';
import APMSkins from './APMSkins';

const { gifs } = APMSkins['塞克西废墟']!;

export default skinTemplate({
  playerBanner: PomeloTheme.playerBanner,
  playerBannerMobile: PomeloTheme.playerBannerMobile,
  // playerBackground: async () => new Promise<string>((resolve) => { resolve('https://cdn.donmai.us/original/f5/cd/__watson_amelia_bubba_and_smol_ame_hololive_and_1_more_drawn_by_ro_g_oowack__f5cd65a11ff91b10f52aba05f46aa5e0.jpg'); }),
  playerBackground: () => fetchVideoPlayUrl('BV1VM411q7j6'),
  playerBackgroundVideo: true,
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: '电鱼播放器',
  desktopTheme: 'light',
  colorTheme: PomeloTheme.colorTheme,
  reactJKPlayerTheme: PomeloTheme.reactJKPlayerTheme,
  maintainer: '铵溶液制造工厂@bilibili',
  maintainerTooltip: '塞克西开~人人爱~',
});
