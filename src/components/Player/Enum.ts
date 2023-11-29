import { skins } from '../../styles/skin';

const Options: NoxPlayer.Option = {
  mode: 'full',
  showThemeSwitch: false,
  showLyric: false,
  toggleMode: false,
  locale: 'zh_CN',
  autoPlayInitLoadPlayList: true,
  autoPlay: false,
  defaultPlayIndex: 0,
  bannerBg: skins().playerBanner,
  themeOverwrite: skins().reactJKPlayerTheme,
};

export default Options;
